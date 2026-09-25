import { useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Languages, Wallet, Camera, ShieldCheck } from 'lucide-react';
import Button from '../components/Button.jsx';
import FormField from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar } from '../services/userService.js';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import { CURRENCIES, LANGUAGES } from '../utils/options.js';

function PhotoStep({ name, existingAvatarUrl, file, previewUrl, onSelect }) {
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
      <p className="mt-3 text-xs text-muted">
        {file ? file.name : 'Tap to upload a profile photo'}
      </p>
    </div>
  );
}

const steps = ['country', 'language', 'currency', 'photo'];

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [stepIndex, setStepIndex] = useState(0);
  const [country, setCountry] = useState(user?.country || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [currency, setCurrency] = useState(user?.currency || 'PKR');
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const activeSteps = user?.avatarUrl ? steps.slice(0, 3) : steps;
  const currentStep = activeSteps[stepIndex];
  const isLastStep = stepIndex === activeSteps.length - 1;

  if (user?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
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
    navigate('/dashboard', { replace: true });
  };

  const handleContinue = async () => {
    setError('');
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
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipPhoto = async () => {
    setError('');
    setSubmitting(true);
    try {
      const data = await updateProfile({ completeOnboarding: true });
      updateUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setError('');
    setStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 py-12">
      <div className="flex items-center gap-2 text-ink">
        <ShieldCheck className="h-5 w-5" />
        <span className="text-lg font-semibold" style={{ fontFamily: "'Sora', 'Inter', sans-serif" }}>
          Vaultrix
        </span>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
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
                <Globe className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">Where are you based?</h1>
                <p className="mt-1 text-sm text-muted">
                  This helps us show the right tax rules and formats later.
                </p>
                <div className="mt-6">
                  <FormField
                    label="Country"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="e.g. Pakistan"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {currentStep === 'language' && (
              <div>
                <Languages className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">Pick your language</h1>
                <p className="mt-1 text-sm text-muted">You can change this anytime in settings.</p>
                <div className="mt-6 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Language</label>
                  <select
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    {LANGUAGES.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 'currency' && (
              <div>
                <Wallet className="h-6 w-6 text-ink" />
                <h1 className="mt-3 text-xl font-semibold text-ink">Choose your currency</h1>
                <p className="mt-1 text-sm text-muted">
                  Every account and transaction will default to this.
                </p>
                <div className="mt-6 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink">Currency</label>
                  <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    className="w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  >
                    {CURRENCIES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 'photo' && (
              <div>
                <h1 className="text-xl font-semibold text-ink">Add a profile photo</h1>
                <p className="mt-1 text-sm text-muted">Optional, but it helps on shared accounts.</p>
                <div className="mt-6">
                  <PhotoStep
                    name={user?.name}
                    existingAvatarUrl={user?.avatarUrl}
                    file={photoFile}
                    previewUrl={previewUrl}
                    onSelect={handlePhotoSelect}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{error}</div>
        )}

        <div className="mt-8 flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:text-ink"
            >
              Back
            </button>
          )}
          <Button onClick={handleContinue} loading={submitting}>
            {isLastStep ? 'Finish' : 'Continue'}
          </Button>
        </div>

        {currentStep === 'photo' && (
          <button
            type="button"
            onClick={handleSkipPhoto}
            disabled={submitting}
            className="mt-3 text-center text-sm text-muted hover:text-ink"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingPage;
