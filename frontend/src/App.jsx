import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function DashboardPlaceholder() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <p className="text-ink">
        {user ? `Signed in as ${user.name}. Dashboard comes next.` : 'No user in session.'}
      </p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPlaceholder />} />
    </Routes>
  );
}

export default App;
