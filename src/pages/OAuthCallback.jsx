import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'orbin_integrations';

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveSaved(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// Maps state param back to integration id
function detectProvider(searchParams) {
  const state = searchParams.get('state');
  if (state) return state;
  // fallback: check pending oauth in saved
  const saved = loadSaved();
  for (const [id, val] of Object.entries(saved)) {
    if (val.pendingOAuth) return id;
  }
  return null;
}

const PROVIDER_NAMES = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  google_calendar: 'Google Calendar',
  hubspot: 'HubSpot',
  linkedin: 'LinkedIn',
};

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing | success | error
  const [message, setMessage] = useState('');
  const [providerName, setProviderName] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');
    const providerId = detectProvider(searchParams);
    const name = PROVIDER_NAMES[providerId] || 'Integration';
    setProviderName(name);

    if (error) {
      setStatus('error');
      setMessage(errorDesc || error);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('No authorization code returned. The OAuth flow may have been cancelled.');
      return;
    }

    // Mark the integration as connected with the auth code stored
    const saved = loadSaved();
    if (providerId && saved[providerId]) {
      saved[providerId] = {
        ...saved[providerId],
        connected: true,
        pendingOAuth: false,
        auth_code: code,
        connected_at: new Date().toISOString(),
      };
      saveSaved(saved);
    }

    setStatus('success');
    setMessage(`${name} was successfully authorised. You can close this page or go back to Integrations.`);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
      <div className="max-w-sm w-full mx-4 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        {status === 'processing' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="font-bold text-slate-800 mb-2">Completing authorisation…</h2>
            <p className="text-sm text-slate-500">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-bold text-slate-800 mb-2">{providerName} Connected!</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
            <Button onClick={() => navigate('/integrations')} className="w-full bg-primary text-white">
              Back to Integrations
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="font-bold text-slate-800 mb-2">Authorisation Failed</h2>
            <p className="text-sm text-slate-500 mb-2 leading-relaxed">{message}</p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-left mb-6">
              <p className="text-xs font-semibold text-amber-700 mb-1">Common fixes:</p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                <li>Make sure this redirect URI is registered in your app's OAuth settings</li>
                <li>Add your Google account as a Test User in Google Cloud Console</li>
                <li>Ensure the OAuth app is not restricted to internal users only</li>
              </ul>
            </div>
            <Button onClick={() => navigate('/integrations')} variant="outline" className="w-full">
              Back to Integrations
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
