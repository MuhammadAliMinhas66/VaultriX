import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, changePassword, uploadAvatar } from '../services/userService.js';
import { resolveAvatarUrl, initialsFromName } from '../utils/avatar.js';
import { CURRENCIES, LANGUAGES } from '../utils/options.js';

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

function Banner({ tone, message }) {
  if (!message) return null;
  const tones = {
    error: 'bg-red-50 text-red-600',
    success: 'bg-emerald-50 text-emerald-600',
  };
  return <div className={`mt-4 rounded-lg px-3.5 py-2.5 text-sm ${tones[tone]}`}>{message}</div>;
}

function ProfileSection() {
  const { user, updateUser } = useAuth();
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
    <SettingsCard title="Profile" subtitle="Your name and photo, visible across your workspace.">
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
          <p className="text-sm font-medium text-ink">Profile photo</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-sm text-muted hover:text-ink"
          >
            Change photo
          </button>
        </div>
      </div>

      <form onSubmit={handleNameSave} className="mt-6 flex flex-col gap-4">
        <FormField label="Full name" value={name} onChange={(event) => setName(event.target.value)} />
        <div>
          <Button type="submit" loading={savingName}>
            Save name
          </Button>
        </div>
      </form>

      <Banner tone={status.tone} message={status.message} />
    </SettingsCard>
  );
}

function PasswordSection() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  if (user?.authProvider === 'google') {
    return (
      <SettingsCard title="Password" subtitle="How you sign in to Vaultrix.">
        <p className="text-sm text-muted">
          Your account signs in with Google, so there is no password to manage here.
        </p>
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
    <SettingsCard title="Password" subtitle="Change the password you use to sign in.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
        />
        <FormField
          label="New password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
        />
        <div>
          <Button type="submit" loading={saving}>
            Update password
          </Button>
        </div>
      </form>
      <Banner tone={status.tone} message={status.message} />
    </SettingsCard>
  );
}

function PreferencesSection() {
  const { user, updateUser } = useAuth();
  const [country, setCountry] = useState(user?.country || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [currency, setCurrency] = useState(user?.currency || 'PKR');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ tone: '', message: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ tone: '', message: '' });
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
    <SettingsCard title="Preferences" subtitle="Country, language and default currency.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          label="Country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          placeholder="e.g. Pakistan"
        />

        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
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

        <div>
          <Button type="submit" loading={saving}>
            Save preferences
          </Button>
        </div>
      </form>
      <Banner tone={status.tone} message={status.message} />
    </SettingsCard>
  );
}

function SettingsPage() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ink">Account settings</h1>
          <button
            onClick={signOut}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-black/[0.03]"
          >
            Sign out
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
