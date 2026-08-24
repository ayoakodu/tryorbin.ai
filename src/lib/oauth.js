const STORAGE_KEY = 'orbin_integrations';
const PKCE_KEY = 'orbin_pkce_verifier';

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveSaved(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64urlEncode(array);
}

export async function generateCodeChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64urlEncode(new Uint8Array(digest));
}

export function storePKCEVerifier(providerId, verifier) {
  try { localStorage.setItem(`${PKCE_KEY}_${providerId}`, verifier); } catch {}
}

export function loadPKCEVerifier(providerId) {
  try {
    const v = localStorage.getItem(`${PKCE_KEY}_${providerId}`);
    localStorage.removeItem(`${PKCE_KEY}_${providerId}`);
    return v;
  } catch { return null; }
}

const REDIRECT_URI = `${window.location.origin}/integrations/callback`;

const TOKEN_ENDPOINTS = {
  gmail: 'https://oauth2.googleapis.com/token',
  google_calendar: 'https://oauth2.googleapis.com/token',
  outlook: (tenantId) => `https://login.microsoftonline.com/${tenantId || 'common'}/oauth2/v2.0/token`,
};

export async function exchangeCodeForToken(providerId, code) {
  const codeVerifier = loadPKCEVerifier(providerId);
  if (!codeVerifier) throw new Error('PKCE verifier missing — please start the OAuth flow again.');

  const saved = loadSaved();
  const creds = saved[providerId]?.creds || {};

  let endpoint, params;

  if (providerId === 'gmail' || providerId === 'google_calendar') {
    endpoint = TOKEN_ENDPOINTS[providerId];
    params = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: creds.client_id,
      code_verifier: codeVerifier,
    };
  } else if (providerId === 'outlook') {
    endpoint = TOKEN_ENDPOINTS.outlook(creds.tenant_id);
    params = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: creds.client_id,
      code_verifier: codeVerifier,
      scope: 'https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Mail.ReadWrite offline_access',
    };
  } else {
    throw new Error(`Token exchange not implemented for ${providerId}`);
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error_description || data.error || `HTTP ${res.status}`);
  }

  const expires_at = Date.now() + data.expires_in * 1000;
  saved[providerId] = {
    ...saved[providerId],
    connected: true,
    pendingOAuth: false,
    access_token: data.access_token,
    refresh_token: data.refresh_token || saved[providerId]?.refresh_token,
    expires_at,
    connected_at: new Date().toISOString(),
  };
  saveSaved(saved);
  return data;
}

export async function refreshAccessToken(providerId) {
  const saved = loadSaved();
  const integration = saved[providerId];
  if (!integration?.refresh_token) throw new Error('No refresh token — please reconnect.');

  const creds = integration.creds || {};
  let endpoint, params;

  if (providerId === 'gmail' || providerId === 'google_calendar') {
    endpoint = TOKEN_ENDPOINTS.gmail;
    params = {
      grant_type: 'refresh_token',
      refresh_token: integration.refresh_token,
      client_id: creds.client_id,
    };
  } else if (providerId === 'outlook') {
    endpoint = TOKEN_ENDPOINTS.outlook(creds.tenant_id);
    params = {
      grant_type: 'refresh_token',
      refresh_token: integration.refresh_token,
      client_id: creds.client_id,
      scope: 'https://graph.microsoft.com/Mail.Send offline_access',
    };
  } else {
    throw new Error(`Token refresh not implemented for ${providerId}`);
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error_description || data.error || `HTTP ${res.status}`);

  const expires_at = Date.now() + data.expires_in * 1000;
  saved[providerId] = {
    ...saved[providerId],
    access_token: data.access_token,
    refresh_token: data.refresh_token || integration.refresh_token,
    expires_at,
  };
  saveSaved(saved);
  return data.access_token;
}

// Returns a valid access token, refreshing if needed (5-min buffer)
export async function getValidToken(providerId) {
  const saved = loadSaved();
  const integration = saved[providerId];
  if (!integration?.connected) throw new Error(`${providerId} is not connected.`);

  // API-key style integrations (hubspot private app, salesforce, whatsapp, etc.)
  if (!integration.access_token) {
    if (integration.creds?.access_token) return integration.creds.access_token;
    if (integration.creds?.api_key) return integration.creds.api_key;
    if (integration.creds?.api_token) return integration.creds.api_token;
    throw new Error(`No token found for ${providerId}.`);
  }

  // OAuth token still valid
  if (integration.expires_at && Date.now() < integration.expires_at - 300_000) {
    return integration.access_token;
  }

  // Refresh
  if (integration.refresh_token) return refreshAccessToken(providerId);

  throw new Error(`Token expired for ${providerId}. Please reconnect.`);
}
