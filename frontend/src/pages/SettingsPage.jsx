import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import Combobox from '../components/Combobox.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, changePassword, uploadAvatar } from '../services/userService.js';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import { useTranslation } from '../i18n/useTranslation.js';
import { useLocalizedOptions } from '../i18n/useLocalizedOptions.js';
import { notify } from '../i18n/notifications.js';
import { serverMessageKey } from '../i18n/translate.js';

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PHOTO_MAX_BYTES = 3 * 1024 * 1024;

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
  const { t, tServer } = useTranslation();
  const inputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [nameError, setNameError] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const avatarSrc = resolveAvatarUrl(user?.avatarUrl);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!PHOTO_TYPES.includes(file.type)) {
      notify.error(t('errors.uploadImageType'));
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      notify.error(t('errors.imageTooLarge'));
      return;
    }

    setUploadingPhoto(true);
    try {
      const data = await uploadAvatar(file);
      updateUser(data.user);
      notify.success(t('status.photoUpdated'));
    } catch (error) {
      notify.error(tServer(error));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleNameSave = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setNameError('status.nameEmpty');
      return;
    }

    setSavingName(true);
    try {
      const data = await updateProfile({ name });
      updateUser(data.user);
      notify.success(t('status.nameUpdated'));
    } catch (error) {
      notify.error(tServer(error));
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
          aria-label={t('settings.changePhoto')}
          aria-busy={uploadingPhoto ? 'true' : undefined}
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
            disabled={uploadingPhoto}
            className="text-sm text-muted hover:text-ink disabled:cursor-wait"
          >
            {uploadingPhoto ? t('common.uploading') : t('settings.changePhoto')}
          </button>
        </div>
      </div>

      <form onSubmit={handleNameSave} noValidate className="mt-6 flex flex-col gap-4">
        <FormField
          label={t('settings.fullName')}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setNameError('');
          }}
          error={nameError && t(nameError)}
        />
        <div>
          <Button type="submit" loading={savingName} loadingLabel={t('common.saving')}>
            {t('settings.saveName')}
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}

function PasswordSection() {
  const { user, setSession } = useAuth();
  const { t, tServer } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  if (user?.authProvider === 'google') {
    return (
      <SettingsCard title={t('settings.passwordTitle')} subtitle={t('settings.passwordSubtitle')}>
        <p className="text-sm text-muted">{t('settings.googleNoPassword')}</p>
      </SettingsCard>
    );
  }

  const clearError = (field) => setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const validate = () => {
    const next = {};
    if (!currentPassword) next.current = 'settings.currentPasswordRequired';
    if (!newPassword) next.new = 'auth.passwordRequired';
    else if (newPassword.length < 8) next.new = 'auth.passwordTooShort';
    if (newPassword && confirmPassword !== newPassword) next.confirm = 'status.passwordMismatch';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const data = await changePassword({ currentPassword, newPassword });
      if (data?.accessToken) setSession(data);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      notify.success(t('status.passwordUpdated'));
    } catch (error) {
      if (serverMessageKey(error) === 'errors.currentPasswordWrong') {
        setFieldErrors({ current: 'errors.currentPasswordWrong' });
      } else {
        notify.error(tServer(error));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard title={t('settings.passwordTitle')} subtitle={t('settings.passwordSubtitle')}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <FormField
          label={t('settings.currentPassword')}
          type="password"
          value={currentPassword}
          onChange={(event) => {
            setCurrentPassword(event.target.value);
            clearError('current');
          }}
          autoComplete="current-password"
          error={fieldErrors.current && t(fieldErrors.current)}
        />
        <FormField
          label={t('settings.newPassword')}
          type="password"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            clearError('new');
          }}
          placeholder={t('auth.signupPasswordPlaceholder')}
          autoComplete="new-password"
          error={fieldErrors.new && t(fieldErrors.new)}
        />
        <FormField
          label={t('settings.confirmPassword')}
          type="password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            clearError('confirm');
          }}
          autoComplete="new-password"
          error={fieldErrors.confirm && t(fieldErrors.confirm)}
        />
        <div>
          <Button type="submit" loading={saving} loadingLabel={t('common.updating')}>
            {t('settings.updatePassword')}
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}

function PreferencesSection() {
  const { user, updateUser, language, currency, setLanguage, setCurrency } = useAuth();
  const { t, tServer } = useTranslation();
  const { countries, languages, currencies } = useLocalizedOptions();
  const [country, setCountry] = useState(user?.country || '');
  const [saving, setSaving] = useState(false);
  const [countryError, setCountryError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!country) {
      setCountryError('onboarding.selectRequired');
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfile({ country, language, currency });
      updateUser(data.user);
      notify.success(t('status.preferencesSaved'));
    } catch (error) {
      notify.error(tServer(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsCard title={t('settings.preferencesTitle')} subtitle={t('settings.preferencesSubtitle')}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Combobox
          label={t('dashboard.country')}
          items={countries}
          value={country}
          onChange={(code) => {
            setCountry(code);
            setCountryError('');
          }}
          placeholder={t('combobox.searchCountries')}
          error={countryError && t(countryError)}
        />
        <Combobox
          label={t('dashboard.language')}
          items={languages}
          value={language}
          onChange={setLanguage}
          placeholder={t('combobox.searchLanguages')}
        />
        <Combobox
          label={t('dashboard.currency')}
          items={currencies}
          value={currency}
          onChange={setCurrency}
          placeholder={t('combobox.searchCurrencies')}
        />

        <div>
          <Button type="submit" loading={saving} loadingLabel={t('common.saving')}>
            {t('settings.savePreferences')}
          </Button>
        </div>
      </form>
    </SettingsCard>
  );
}

function SettingsPage() {
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-ink">{t('settings.title')}</h1>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut ? 'true' : undefined}
            className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.03] disabled:cursor-wait disabled:opacity-70"
          >
            {signingOut && <Loader2 className="h-4 w-4 animate-spin" />}
            {signingOut ? t('common.signingOut') : t('settings.signOut')}
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
