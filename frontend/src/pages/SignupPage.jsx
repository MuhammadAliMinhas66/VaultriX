import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import EmailField from '../components/EmailField.jsx';
import Button from '../components/Button.jsx';
import Captcha, { captchaEnabled } from '../components/Captcha.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import { passwordIssue } from '../utils/emailRules.js';
import GoogleAuthButton from '../components/GoogleAuthButton.jsx';
import PageLoader from '../components/PageLoader.jsx';
import { signup } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/useTranslation.js';
import { notify } from '../i18n/notifications.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { t, tServer } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState('idle');
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const proceedAfterAuth = (data) => {
    setSession(data);
    setRedirecting(true);
    setTimeout(() => {
      navigate(data.user.onboardingCompleted ? '/dashboard' : '/onboarding', { replace: true });
    }, 500);
  };

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'auth.nameRequired';
    else if (name.trim().length < 2 || name.trim().length > 60 || /[<>{}\[\]\\/$`]/.test(name)) next.name = 'errors.nameInvalid';
    if (!email.trim()) next.email = 'auth.emailRequired';
    else if (!EMAIL_PATTERN.test(email.trim()) || emailStatus === 'invalid') next.email = 'auth.emailInvalid';
    else if (emailStatus === 'disposable') next.email = 'auth.emailDisposable';
    else if (emailStatus === 'no_mail_server') next.email = 'auth.emailNoMailServer';
    const issue = passwordIssue(password);
    if (issue) next.password = issue;
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await signup({ name: name.trim(), email: email.trim(), password, captchaToken });
      proceedAfterAuth(data);
    } catch (error) {
      notify.error(tServer(error));
      captchaRef.current?.reset();
      setLoading(false);
    }
  };

  const clearError = (field) => setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  if (redirecting) {
    return <PageLoader label={t('auth.settingUp')} />;
  }

  return (
    <AuthLayout title={t('auth.signupTitle')} subtitle={t('auth.signupSubtitle')}>
      <GoogleAuthButton onError={(message) => notify.error(message)} />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">{t('auth.or')}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          label={t('auth.fullNameLabel')}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            clearError('name');
          }}
          placeholder={t('auth.fullNamePlaceholder')}
          autoComplete="name"
          error={fieldErrors.name && t(fieldErrors.name)}
        />

        <EmailField
          label={t('auth.emailLabel')}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            clearError('email');
          }}
          placeholder={t('auth.emailPlaceholder')}
          checkProvider
          onStatusChange={setEmailStatus}
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
            placeholder={t('auth.signupPasswordPlaceholder')}
            autoComplete="new-password"
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

        {password && <PasswordStrength password={password} />}

        <Captcha ref={captchaRef} onToken={setCaptchaToken} />

        <Button
          type="submit"
          loading={loading}
          loadingLabel={t('auth.creatingAccount')}
          disabled={captchaEnabled && !captchaToken}
        >
          {captchaEnabled && !captchaToken ? t('captcha.verifying') : t('auth.createAccount')}
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-muted">{t('auth.onboardingNote')}</p>

      <p className="mt-6 text-center text-sm text-muted">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="font-medium text-ink hover:underline">
          {t('auth.signInLink')}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default SignupPage;
