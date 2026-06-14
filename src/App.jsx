import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#f1f5f9' }}>
          <div className="text-center p-8 max-w-md">
            <h2 className="text-lg font-bold text-foreground mb-2">Something went wrong</h2>
            <p className="text-sm text-muted-foreground mb-4">An unexpected error occurred. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Page imports
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Pipeline from './pages/Pipeline';
import Outreach from './pages/Outreach';
import Campaigns from './pages/Campaigns';
import Analytics from './pages/Analytics';
import WhatsApp from './pages/WhatsApp';
import AICopilot from './pages/AICopilot';
import Integrations from './pages/Integrations';
import Automations from './pages/Automations';
import Collaboration from './pages/Collaboration';
import Lists from './pages/Lists';
import Emails from './pages/Emails';
import Calls from './pages/Calls';
import Broadcasts from './pages/Broadcasts';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Deliverability from './pages/Deliverability.jsx';
import OnboardingHub from './pages/OnboardingHub';
import SequenceBuilder from './pages/SequenceBuilder';
import EmailOps from './pages/EmailOps';
import OAuthCallback from './pages/OAuthCallback';

// Layout
import AppLayout from './components/layout/AppLayout';

const LOGO_URL = 'https://media.base44.com/images/public/6a075dcc5cdaf3650af66cec/6e7cc42e3_OrbinAIIcon.png';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#f1f5f9' }}>
        <div className="flex flex-col items-center gap-4">
          <img src={LOGO_URL} alt="Orbin" className="w-10 h-10 rounded-xl object-contain animate-pulse" />
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      
      {/* App Routes with Layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/outreach" element={<Outreach />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/ai-copilot" element={<AICopilot />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/collaboration" element={<Collaboration />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/broadcasts" element={<Broadcasts />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/deliverability" element={<Deliverability />} />
        <Route path="/onboarding-hub" element={<OnboardingHub />} />
        <Route path="/sequence-builder" element={<SequenceBuilder />} />
        <Route path="/email-ops" element={<EmailOps />} />
      </Route>

      <Route path="/integrations/callback" element={<OAuthCallback />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
