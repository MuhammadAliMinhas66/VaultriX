import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import RequireOnboarding from './components/RequireOnboarding.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import { useAuth } from './context/AuthContext.jsx';

function DashboardPlaceholder() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />
      <div className="flex flex-col items-center justify-center gap-2 px-6 py-24 text-center">
        <p className="text-ink">
          {user ? `Signed in as ${user.name}. Dashboard comes next.` : 'No user in session.'}
        </p>
        <p className="text-sm text-muted">Your account settings are one tap away, top right.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<RequireOnboarding />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
