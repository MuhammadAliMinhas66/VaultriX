import { useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';
import Button from '../components/Button.jsx';
import Combobox from '../components/Combobox.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import Logo from '../components/Logo.jsx';
import PageLoader from '../components/PageLoader.jsx';
import { CountryIcon, LanguageIcon, CurrencyIcon } from '../components/icons/StepIcons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar } from '../services/userService.js';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import { COUNTRIES } from '../utils/countries.js';
import { CURRENCIES } from '../utils/options.js';
import { LANGUAGES } from '../utils/options.js';
import { useTranslation } from '../i18n/useTranslation.js';

function PhotoStep({ name, existingAvatarUrl, file, previewUrl, onSelect, prompt }) {
  const inputRef = useRef(null);
  const displaySrc = previewUrl || resolveAvatarUrl(existingAvatarUrl);

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onSelect(selected);
        }}
      />
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => inputRef.current?.click()}
        className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-surface"
      >
        {displaySrc ? (
          <img src={displaySrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg font-medium text-muted">{initialsFromName(name) || '?'}</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition hover:bg-black/40 hover:opacity-100">
          <Camera className="h-5 w-5" />
        </span>
      </motion.button>
      <p className="mt-3 text-xs text-muted">{file ? file.name : prompt}</p>
    </div>
  );
}

const steps = ['country', 'language', 'currency', 'photo'];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t, tServer } = useTranslation();

  const [stepIndex, setStepIndex] = useState(0);
  const [country, setCountry] = useState('');
  const [language, setLanguage] = useState('');
  const [currency, setCurrency] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [welcoming, setWelcoming] = useState(false);

  const activeSteps = user?.avatarUrl ? steps.slice(0, 3) : steps;
  const currentStep = activeSteps[stepIndex];
  const isLastStep = stepIndex === activeSteps.length - 1;

  const requiredValueByStep = { country, language, currency, photo: 'optional' };
  const canContinue = Boolean(requiredValueByStep[currentStep]);

  if (user?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  if (welcoming) {
    return (
      <PageLoader
        title={t('onboarding.welcomeTitle', { name: user?.name?.split(' ')[0] || '' })}
        label={t('onboarding.welcomeSubtitle')}
      />
    );
  }

  const handlePhotoSelect = (file) => {
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const finish = async () => {
    if (photoFile) {
      const avatarData = await uploadAvatar(photoFile);
      updateUser(avatarData.user);
    }
    const data = await updateProfile({ completeOnboarding: true });
    updateUser(data.user);

    setWelcoming(true);
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1600);
  };

  const handleContinue = async () => {
    setError('');

    if (!canContinue) {
      setError(t('onboarding.selectRequired'));
      return;
    }

    setSubmitting(true);
    try {
      if (currentStep === 'country') {
        const data = await updateProfile({ country });
        updateUser(data.user);
      } else if (currentStep === 'language') {
        const data = await updateProfile({ language });
        updateUser(data.user);
      } else if (currentStep === 'currency') {
        const data = await updateProfile({ currency });
        updateUser(data.user);
      }

      if (isLastStep) {
        await finish();
        return;
      }

      setStepIndex((prev) => prev + 1);
    } catch (err) {
      setError(tServer(err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipPhoto = async () => {
    setError('');
    setSubmitting(true);
    try {
      await finish();
    } catch (err) {
      setError(tServer(err.message));
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setError('');
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-12">
      <Logo size="sm" />

      <div className="mt-6 flex items-center gap-1.5">
        {activeSteps.map((step, index) => (
          <span
            key={step}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === stepIndex ? 'w-6 bg-ink' : 'w-1.5 bg-border'
            }`}
          />
        ))}
      </div>

      <div className="flex w-full max-w-sm flex-1 flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {currentStep === 'country' && (
              <div>
                <CountryIcon className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">{t('onboarding.countryTitle')}</h1>
                <p className="mt-1 text-sm text-muted">{t('onboarding.countrySubtitle')}</p>
                <div className="mt-6">
                  <Combobox items={COUNTRIES} value={country} onChange={setCountry} placeholder={t('combobox.searchCountries')} />
                </div>
              </div>
            )}

            {currentStep === 'language' && (
              <div>
                <LanguageIcon className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">{t('onboarding.languageTitle')}</h1>
                <p className="mt-1 text-sm text-muted">{t('onboarding.languageSubtitle')}</p>
                <div className="mt-6">
                  <Combobox items={LANGUAGES} value={language} onChange={setLanguage} placeholder={t('combobox.searchLanguages')} />
                </div>
              </div>
            )}

            {currentStep === 'currency' && (
              <div>
                <CurrencyIcon className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">{t('onboarding.currencyTitle')}</h1>
                <p className="mt-1 text-sm text-muted">{t('onboarding.currencySubtitle')}</p>
                <div className="mt-6">
                  <Combobox items={CURRENCIES} value={currency} onChange={setCurrency} placeholder={t('combobox.searchCurrencies')} />
                </div>
              </div>
            )}

            {currentStep === 'photo' && (
              <div>
                <h1 className="text-xl font-semibold text-ink">{t('onboarding.photoTitle')}</h1>
                <p className="mt-1 text-sm text-muted">{t('onboarding.photoSubtitle')}</p>
                <div className="mt-6">
                  <PhotoStep
                    name={user?.name}
                    existingAvatarUrl={user?.avatarUrl}
                    file={photoFile}
                    previewUrl={previewUrl}
                    onSelect={handlePhotoSelect}
                    prompt={t('onboarding.uploadPrompt')}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-4">
          <AlertBanner tone="error" message={error} onDismiss={() => setError('')} />
        </div>

        <div className="mt-6 flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:text-ink"
            >
              {t('onboarding.back')}
            </button>
          )}
          <Button onClick={handleContinue} loading={submitting} disabled={!canContinue}>
            {isLastStep ? t('onboarding.finish') : t('onboarding.continue')}
          </Button>
        </div>

        {currentStep === 'photo' && (
          <button
            type="button"
            onClick={handleSkipPhoto}
            disabled={submitting}
            className="mt-3 text-center text-sm text-muted hover:text-ink"
          >
            {t('onboarding.skip')}
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;
