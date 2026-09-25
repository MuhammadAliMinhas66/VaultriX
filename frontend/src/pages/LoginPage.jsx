import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import PageLoader from '../components/PageLoader.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { login } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/useTranslation.js';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const { t, tServer } = useTranslation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [formError, setFormError] = useState(
    new URLSearchParams(location.search).get('google_error') ? t('auth.googleFailed') : ''
  );

  const proceedAfterAuth = (data) => {
    setSession(data);
    setRedirecting(true);
    setTimeout(() => {
      const destination = data.user.onboardingCompleted ? redirectTo : '/onboarding';
      navigate(destination, { replace: true });
    }, 500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError(t('auth.enterCredentials'));
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });
      proceedAfterAuth(data);
    } catch (error) {
      setFormError(tServer(error.message));
      setLoading(false);
    }
  };

  if (redirecting) {
    return <PageLoader label={t('auth.settingUp')} />;
  }

  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <GoogleAuthButton onError={setFormError} />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">{t('auth.or')}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label={t('auth.emailLabel')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="email"
        />

        <div className="relative">
          <FormField
            label={t('auth.passwordLabel')}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-muted hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-muted hover:text-ink">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <AlertBanner tone="error" message={formError} onDismiss={() => setFormError('')} />

        <Button type="submit" loading={loading}>
          {t('auth.signIn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="font-medium text-ink hover:underline">
          {t('auth.createOne')}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
