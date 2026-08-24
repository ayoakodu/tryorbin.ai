import { getValidToken } from './oauth';

const STORAGE_KEY = 'orbin_integrations';

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

export function isIntegrationConnected(id) {
  return !!loadSaved()[id]?.connected;
}

export function getConnectedEmailProvider() {
  const saved = loadSaved();
  if (saved.gmail?.connected) return 'gmail';
  if (saved.outlook?.connected) return 'outlook';
  return null;
}

// ── Email ──────────────────────────────────────────────────────────────────

async function sendViaGmail(token, { to, subject, body, html }) {
  const rawEmail = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html || body,
  ].join('\r\n');

  const encoded = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: encoded }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `Gmail error ${res.status}`);
  }
  return res.json();
}

async function sendViaOutlook(token, { to, subject, body, html }) {
  const res = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: html ? 'HTML' : 'Text', content: html || body },
        toRecipients: [{ emailAddress: { address: to } }],
      },
    }),
  });
  if (res.status !== 202 && !res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Graph error ${res.status}`);
  }
}

export async function sendEmail({ to, subject, body, html }) {
  const provider = getConnectedEmailProvider();
  if (!provider) throw new Error('No email provider connected. Connect Gmail or Outlook in Integrations.');
  const token = await getValidToken(provider);
  if (provider === 'gmail') return sendViaGmail(token, { to, subject, body, html });
  if (provider === 'outlook') return sendViaOutlook(token, { to, subject, body, html });
}

export async function getEmailProfile() {
  const provider = getConnectedEmailProvider();
  if (!provider) throw new Error('No email provider connected.');
  const token = await getValidToken(provider);

  if (provider === 'gmail') {
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Gmail profile error ${res.status}`);
    return res.json();
  }
  if (provider === 'outlook') {
    const res = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Graph profile error ${res.status}`);
    return res.json();
  }
}

// ── HubSpot ────────────────────────────────────────────────────────────────

export async function getHubSpotContacts(limit = 100) {
  const token = await getValidToken('hubspot');
  const res = await fetch(
    `https://api.hubapi.com/crm/v3/objects/contacts?limit=${limit}&properties=firstname,lastname,email,company,phone,jobtitle`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`HubSpot error ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function createHubSpotContact({ firstName, lastName, email, company, phone, jobTitle }) {
  const token = await getValidToken('hubspot');
  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { firstname: firstName, lastname: lastName, email, company, phone, jobtitle: jobTitle },
    }),
  });
  if (!res.ok) throw new Error(`HubSpot create contact error ${res.status}`);
  return res.json();
}

export async function getHubSpotDeals(limit = 100) {
  const token = await getValidToken('hubspot');
  const res = await fetch(
    `https://api.hubapi.com/crm/v3/objects/deals?limit=${limit}&properties=dealname,amount,dealstage,closedate,hubspot_owner_id`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`HubSpot deals error ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

export async function updateHubSpotDealStage(dealId, stage) {
  const token = await getValidToken('hubspot');
  const res = await fetch(`https://api.hubapi.com/crm/v3/objects/deals/${dealId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: { dealstage: stage } }),
  });
  if (!res.ok) throw new Error(`HubSpot update deal error ${res.status}`);
  return res.json();
}

// ── Slack ──────────────────────────────────────────────────────────────────

export async function sendSlackNotification(text) {
  const saved = loadSaved();
  const creds = saved.slack?.creds;
  if (!creds?.webhook_url) throw new Error('Slack not connected.');
  const res = await fetch(creds.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Slack error ${res.status}`);
}

// ── WhatsApp ───────────────────────────────────────────────────────────────

export async function sendWhatsAppTextMessage(to, message) {
  const saved = loadSaved();
  const creds = saved.whatsapp?.creds;
  if (!creds?.access_token || !creds?.phone_id) throw new Error('WhatsApp not connected.');
  const res = await fetch(`https://graph.facebook.com/v18.0/${creds.phone_id}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${creds.access_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `WhatsApp error ${res.status}`);
  }
  return res.json();
}

// ── Salesforce ─────────────────────────────────────────────────────────────

export async function getSalesforceContacts(limit = 100) {
  const saved = loadSaved();
  const creds = saved.salesforce?.creds;
  if (!creds?.instance_url || !creds?.access_token) throw new Error('Salesforce not connected.');
  const res = await fetch(
    `${creds.instance_url}/services/data/v58.0/query?q=SELECT+Id,FirstName,LastName,Email,Title,Account.Name+FROM+Contact+LIMIT+${limit}`,
    { headers: { Authorization: `Bearer ${creds.access_token}` } }
  );
  if (!res.ok) throw new Error(`Salesforce error ${res.status}`);
  const data = await res.json();
  return data.records || [];
}

// ── Zapier ─────────────────────────────────────────────────────────────────

export async function triggerZapierWebhook(event, payload = {}) {
  const saved = loadSaved();
  const creds = saved.zapier?.creds;
  if (!creds?.webhook_url) throw new Error('Zapier not connected.');
  const res = await fetch(creds.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'Orbin', event, timestamp: new Date().toISOString(), ...payload }),
  });
  if (!res.ok) throw new Error(`Zapier webhook error ${res.status}`);
}
