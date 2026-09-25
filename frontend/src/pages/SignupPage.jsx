import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import PageLoader from '../components/PageLoader.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { signup, googleAuth } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';

function SignupPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [formError, setFormError] = useState('');

  const proceedAfterAuth = (data) => {
    setSession(data);
    setRedirecting(true);
    setTimeout(() => {
      navigate(data.user.onboardingCompleted ? '/dashboard' : '/onboarding', { replace: true });
    }, 500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!name || !email || !password) {
      setFormError('Fill in your name, email and password to continue.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password needs to be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await signup({ name, email, password });
      proceedAfterAuth(data);
    } catch (error) {
      setFormError(error.message);
      setLoading(false);
    }
  };

  const handleGoogle = async (idToken) => {
    setFormError('');
    setLoading(true);
    try {
      const data = await googleAuth(idToken);
      proceedAfterAuth(data);
    } catch (error) {
      setFormError(error.message);
      setLoading(false);
    }
  };

  if (redirecting) {
    return <PageLoader label="Setting things up" />;
  }

  return (
    <AuthLayout title="Create your account" subtitle="Set up Vaultrix in under a minute.">
      <GoogleAuthButton onSuccess={handleGoogle} onError={setFormError} />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          autoComplete="name"
        />

        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <div className="relative">
          <FormField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-muted hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <AlertBanner tone="error" message={formError} />

        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-muted">
        You will pick your country, language, currency and photo next.
      </p>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ink hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default SignupPage;
