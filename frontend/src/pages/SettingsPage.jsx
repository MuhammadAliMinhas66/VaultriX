import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import Combobox from '../components/Combobox.jsx';
import AlertBanner from '../components/AlertBanner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, changePassword, uploadAvatar } from '../services/userService.js';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import { COUNTRIES } from '../utils/countries.js';
import { CURRENCIES, LANGUAGES } from '../utils/options.js';
import { useTranslation } from '../i18n/useTranslation.js';

function SettingsCard({ title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-white p-6"
    >
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function ProfileSection() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [savingName, setSavingName] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  const avatarSrc = resolveAvatarUrl(user?.avatarUrl);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus({ tone: '', message: '' });
    setUploadingPhoto(true);
    try {
      const data = await uploadAvatar(file);
      updateUser(data.user);
      setStatus({ tone: 'success', message: 'Your photo has been updated.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message });
    } finally {
      setUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleNameSave = async (event) => {
    event.preventDefault();
    setStatus({ tone: '', message: '' });

    if (!name.trim()) {
      setStatus({ tone: 'error', message: 'Your name cannot be empty.' });
      return;
    }

    setSavingName(true);
    try {
      const data = await updateProfile({ name });
      updateUser(data.user);
      setStatus({ tone: 'success', message: 'Your name has been updated.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message });
    } finally {
      setSavingName(false);
    }
  };

  return (
    <SettingsCard title={t('settings.profileTitle')} subtitle={t('settings.profileSubtitle')}>
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadingPhoto}
          className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-border bg-surface"
        >
          {uploadingPhoto ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted" />
          ) : avatarSrc ? (
            <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-muted">{initialsFromName(user?.name)}</span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition hover:bg-black/40 hover:opacity-100">
            <Camera className="h-4 w-4" />
          </span>
        </button>
        <div>
          <p className="text-sm font-medium text-ink">{t('settings.photoLabel')}</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-muted hover:text-ink"
          >
            {t('settings.changePhoto')}
          </button>
        </div>
      </div>

      <form onSubmit={handleNameSave} className="mt-6 flex flex-col gap-4">
        <FormField
          label={t('settings.fullName')}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div>
          <Button type="submit" loading={savingName}>
            {t('settings.saveName')}
          </Button>
        </div>
      </form>

      <div className="mt-4">
        <AlertBanner tone={status.tone} message={status.message} />
      </div>
    </SettingsCard>
  );
}

function PasswordSection() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  if (user?.authProvider === 'google') {
    return (
      <SettingsCard title={t('settings.passwordTitle')} subtitle={t('settings.passwordSubtitle')}>
        <p className="text-sm text-muted">{t('settings.googleNoPassword')}</p>
      </SettingsCard>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ tone: '', message: '' });

    if (newPassword.length < 8) {
      setStatus({ tone: 'error', message: 'New password needs to be at least 8 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ tone: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setStatus({ tone: 'success', message: 'Your password has been changed.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard title={t('settings.passwordTitle')} subtitle={t('settings.passwordSubtitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label={t('settings.currentPassword')}
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
        />
        <FormField
          label={t('settings.newPassword')}
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <FormField
          label={t('settings.confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
        />
        <div>
          <Button type="submit" loading={saving}>
            {t('settings.updatePassword')}
          </Button>
        </div>
      </form>
      <div className="mt-4">
        <AlertBanner tone={status.tone} message={status.message} />
      </div>
    </SettingsCard>
  );
}

function PreferencesSection() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [country, setCountry] = useState(user?.country || '');
  const [language, setLanguage] = useState(user?.language || '');
  const [currency, setCurrency] = useState(user?.currency || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ tone: '', message: '' });

    if (!country || !language || !currency) {
      setStatus({ tone: 'error', message: t('onboarding.selectRequired') });
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfile({ country, language, currency });
      updateUser(data.user);
      setStatus({ tone: 'success', message: 'Your preferences have been saved.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard title={t('settings.preferencesTitle')} subtitle={t('settings.preferencesSubtitle')}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Combobox
          label={t('dashboard.country')}
          items={COUNTRIES}
          value={country}
          onChange={setCountry}
          placeholder="Search countries"
        />
        <Combobox
          label={t('dashboard.language')}
          items={LANGUAGES}
          value={language}
          onChange={setLanguage}
          placeholder="Search languages"
        />
        <Combobox
          label={t('dashboard.currency')}
          items={CURRENCIES}
          value={currency}
          onChange={setCurrency}
          placeholder="Search currencies"
        />

        <div>
          <Button type="submit" loading={saving}>
            {t('settings.savePreferences')}
          </Button>
        </div>
      </form>
      <div className="mt-4">
        <AlertBanner tone={status.tone} message={status.message} />
      </div>
    </SettingsCard>
  );
}

function SettingsPage() {
  const { signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ink">{t('settings.title')}</h1>
          <button
            onClick={signOut}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.03]"
          >
            {t('settings.signOut')}
          </button>
        </div>

        <ProfileSection />
        <PasswordSection />
        <PreferencesSection />
      </div>
    </div>
  );
}

export default SettingsPage;
