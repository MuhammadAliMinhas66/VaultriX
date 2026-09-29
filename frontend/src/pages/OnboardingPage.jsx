import { useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import Button from '../components/Button.jsx';
import Combobox from '../components/Combobox.jsx';
import Logo from '../components/Logo.jsx';
import PageLoader from '../components/PageLoader.jsx';
import { CountryIcon, LanguageIcon, CurrencyIcon } from '../components/icons/StepIcons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar } from '../services/userService.js';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import { useTranslation } from '../i18n/useTranslation.js';
import { useLocalizedOptions } from '../i18n/useLocalizedOptions.js';
import { notify } from '../i18n/notifications.js';

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PHOTO_MAX_BYTES = 3 * 1024 * 1024;

function PhotoStep({ name, existingAvatarUrl, file, previewUrl, error, uploading, onSelect, onClear, t }) {
  const inputRef = useRef(null);
  const displaySrc = previewUrl || resolveAvatarUrl(existingAvatarUrl);
  const hasImage = Boolean(displaySrc);

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          event.target.value = '';
          if (selected) onSelect(selected);
        }}
      />

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={hasImage ? t('onboarding.photoChange') : t('onboarding.photoChoose')}
        aria-busy={uploading ? 'true' : undefined}
        className={`group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-surface transition ${
          error
            ? 'border-2 border-red-400'
            : hasImage
              ? 'border border-border'
              : 'border-2 border-dashed border-border hover:border-ink/40'
        }`}
      >
        {hasImage ? (
          <img src={displaySrc} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-muted">
            <span className="text-xl font-medium">{initialsFromName(name) || '?'}</span>
            <Camera className="h-4 w-4" />
          </span>
        )}
        {hasImage && !uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100 group-focus-visible:bg-black/40 group-focus-visible:opacity-100">
            <Camera className="h-5 w-5" />
          </span>
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 className="h-5 w-5 animate-spin text-ink" />
          </span>
        )}
      </motion.button>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-border bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:bg-black/[0.03] disabled:cursor-wait disabled:opacity-70"
        >
          {uploading ? t('common.uploading') : hasImage ? t('onboarding.photoChange') : t('onboarding.photoChoose')}
        </button>
        {file && !uploading && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('onboarding.photoRemove')}
          </button>
        )}
      </div>

      {file && <p className="mt-3 max-w-full truncate text-xs text-ink">{file.name}</p>}
      {error ? (
        <p role="alert" className="mt-2 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-center text-xs text-muted">{t('onboarding.photoHint')}</p>
      )}
    </div>
  );
}

const steps = ['country', 'language', 'currency', 'photo'];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser, language: appLanguage, currency: savedCurrency } = useAuth();
  const { t, tServer } = useTranslation();
  const { countries, languages, currencies } = useLocalizedOptions();

  const [stepIndex, setStepIndex] = useState(0);
  // Prefilled from THIS account only (empty for a brand-new one). The language
  // starts as the app's current language (English for a new account) and stays a
  // pending choice until the language step is confirmed with Continue.
  const [country, setCountry] = useState(user?.country || '');
  const [language, setLanguage] = useState(appLanguage);
  const [currency, setCurrency] = useState(savedCurrency || '');
  const [photoError, setPhotoError] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
    if (!PHOTO_TYPES.includes(file.type)) {
      setPhotoError(t('errors.uploadImageType'));
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      setPhotoError(t('errors.imageTooLarge'));
      return;
    }
    setPhotoError('');
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhotoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePhotoClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPhotoFile(null);
    setPreviewUrl('');
    setPhotoError('');
  };

  const finish = async () => {
    if (photoFile) {
      setUploadingPhoto(true);
      try {
        const avatarData = await uploadAvatar(photoFile);
        updateUser(avatarData.user);
      } finally {
        setUploadingPhoto(false);
      }
    }
    const data = await updateProfile({ completeOnboarding: true });
    updateUser(data.user);

    setWelcoming(true);
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1600);
  };

  const handleContinue = async () => {
    if (!canContinue) {
      notify.warning(t('onboarding.selectRequired'));
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
      notify.error(tServer(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipPhoto = async () => {
    setSubmitting(true);
    try {
      await finish();
    } catch (err) {
      notify.error(tServer(err));
      setSubmitting(false);
    }
  };

  const handleBack = () => {
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
                  <Combobox items={countries} value={country} onChange={setCountry} placeholder={t('combobox.searchCountries')} />
                </div>
                <p className="mt-3 text-xs text-muted">{t('onboarding.countryNote')}</p>
              </div>
            )}

            {currentStep === 'language' && (
              <div>
                <LanguageIcon className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">{t('onboarding.languageTitle')}</h1>
                <p className="mt-1 text-sm text-muted">{t('onboarding.languageSubtitle')}</p>
                <div className="mt-6">
                  <Combobox items={languages} value={language} onChange={setLanguage} placeholder={t('combobox.searchLanguages')} />
                </div>
                <p className="mt-3 text-xs text-muted">{t('onboarding.languageNote')}</p>
              </div>
            )}

            {currentStep === 'currency' && (
              <div>
                <CurrencyIcon className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">{t('onboarding.currencyTitle')}</h1>
                <p className="mt-1 text-sm text-muted">{t('onboarding.currencySubtitle')}</p>
                <div className="mt-6">
                  <Combobox items={currencies} value={currency} onChange={setCurrency} placeholder={t('combobox.searchCurrencies')} />
                </div>
                <p className="mt-3 text-xs text-muted">{t('onboarding.currencyNote')}</p>
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
                    error={photoError}
                    uploading={uploadingPhoto}
                    onSelect={handlePhotoSelect}
                    onClear={handlePhotoClear}
                    t={t}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

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
          <Button onClick={handleContinue} loading={submitting} loadingLabel={t('common.saving')} disabled={!canContinue}>
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
            {submitting ? t('common.saving') : t('onboarding.skip')}
          </button>
        )}
      </div>
    </div>
  );
}

// Keyed by account id so onboarding state can never carry over between users.
function OnboardingRoute() {
  const { user } = useAuth();
  return <OnboardingPage key={user?.id} />;
}

export default OnboardingRoute;
