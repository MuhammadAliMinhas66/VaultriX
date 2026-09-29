import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import EmailField from '../components/EmailField.jsx';
import Button from '../components/Button.jsx';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import PageLoader from '../components/PageLoader.jsx';
import { login } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/useTranslation.js';
import { notify } from '../i18n/notifications.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();
  const { t, tServer } = useTranslation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (new URLSearchParams(location.search).get('google_error')) {
      notify.error(t('auth.googleFailed'));
      navigate('/login', { replace: true });
    }
  }, []);

  const proceedAfterAuth = (data) => {
    setSession(data);
    setRedirecting(true);
    setTimeout(() => {
      const destination = data.user.onboardingCompleted ? redirectTo : '/onboarding';
      navigate(destination, { replace: true });
    }, 500);
  };

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'auth.emailRequired';
    else if (!EMAIL_PATTERN.test(email.trim())) next.email = 'auth.emailInvalid';
    if (!password) next.password = 'auth.passwordRequired';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      proceedAfterAuth(data);
    } catch (error) {
      notify.error(tServer(error));
      setLoading(false);
    }
  };

  const clearError = (field) => setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  if (redirecting) {
    return <PageLoader label={t('auth.settingUp')} />;
  }

  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <GoogleAuthButton onError={(message) => notify.error(message)} />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">{t('auth.or')}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <EmailField
          label={t('auth.emailLabel')}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError('email');
          }}
          placeholder={t('auth.emailPlaceholder')}
          error={fieldErrors.email && t(fieldErrors.email)}
        />

        <div className="relative">
          <FormField
            label={t('auth.passwordLabel')}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              clearError('password');
            }}
            placeholder={t('auth.passwordPlaceholder')}
            autoComplete="current-password"
            error={fieldErrors.password && t(fieldErrors.password)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            className="absolute right-3 top-9 text-muted hover:text-ink"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            state={{ email: email.trim() }}
            className="text-sm text-muted hover:text-ink"
          >
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Button type="submit" loading={loading} loadingLabel={t('auth.signingIn')}>
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
