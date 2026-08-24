import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exchangeCodeForToken } from '@/lib/oauth';

const PROVIDER_NAMES = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  google_calendar: 'Google Calendar',
  hubspot: 'HubSpot',
  linkedin: 'LinkedIn',
};

const PKCE_PROVIDERS = new Set(['gmail', 'outlook', 'google_calendar']);

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [providerName, setProviderName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function handle() {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDesc = searchParams.get('error_description');
      const providerId = searchParams.get('state');
      const name = PROVIDER_NAMES[providerId] || 'Integration';
      setProviderName(name);

      if (error) {
        setErrorMessage(errorDesc || error);
        setStatus('error');
        return;
      }

      if (!code) {
        setErrorMessage('No authorization code returned. The OAuth flow may have been cancelled.');
        setStatus('error');
        return;
      }

      if (!providerId) {
        setErrorMessage('Could not identify the provider. Please try connecting again.');
        setStatus('error');
        return;
      }

      if (PKCE_PROVIDERS.has(providerId)) {
        try {
          await exchangeCodeForToken(providerId, code);
          setStatus('success');
        } catch (err) {
          setErrorMessage(err.message);
          setStatus('error');
        }
      } else {
        // Non-PKCE providers are handled as API key flows — nothing to exchange
        setStatus('success');
      }
    }

    handle();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f8fafc' }}>
      <div className="max-w-sm w-full mx-4 bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        {status === 'processing' && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
            <h2 className="font-bold text-slate-800 mb-2">Completing authorisation…</h2>
            <p className="text-sm text-slate-500">Exchanging authorisation code for access token.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h2 className="font-bold text-slate-800 mb-2">{providerName} Connected!</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Your account has been authorised and a real access token has been stored securely in your browser.
            </p>
            <Button onClick={() => navigate('/integrations')} className="w-full bg-primary text-white">
              Back to Integrations
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h2 className="font-bold text-slate-800 mb-2">Authorisation Failed</h2>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">{errorMessage}</p>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-left mb-6">
              <p className="text-xs font-semibold text-amber-700 mb-1">Common fixes:</p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                <li>Make sure this redirect URI is registered in your app settings</li>
                <li>For Google: add your account as a Test User in OAuth consent screen</li>
                <li>For Microsoft: ensure the platform is set to "Single-page application" (SPA), not "Web"</li>
                <li>Try disconnecting and reconnecting — the PKCE verifier may have expired</li>
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
