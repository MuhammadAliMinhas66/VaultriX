import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import RequireOnboarding from './components/RequireOnboarding.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useTranslation } from './i18n/useTranslation.js';
import { COUNTRIES } from './utils/countries.js';
import { CURRENCIES, LANGUAGES, formatCurrency } from './utils/options.js';

function PreferenceChip({ label, value }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-left">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

function DashboardPlaceholder() {
  const { user } = useAuth();
  const { t, language } = useTranslation();

  const country = COUNTRIES.find((item) => item.value === user?.country);
  const languageOption = LANGUAGES.find((item) => item.value === user?.language);
  const currencyOption = CURRENCIES.find((item) => item.value === user?.currency);

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <div>
          <p className="text-ink">
            {user ? t('dashboard.welcomeSignedIn', { name: user.name }) : t('dashboard.noUser')}
          </p>
          <p className="mt-1 text-sm text-muted">{t('dashboard.settingsHint')}</p>
        </div>

        {user && (
          <div className="grid grid-cols-3 gap-3">
            <PreferenceChip
              label={t('dashboard.country')}
              value={country ? `${country.flag} ${country.label}` : '-'}
            />
            <PreferenceChip label={t('dashboard.language')} value={languageOption?.label || '-'} />
            <PreferenceChip
              label={t('dashboard.currency')}
              value={
                currencyOption ? `${currencyOption.value} ${formatCurrency(0, currencyOption.value, language)}` : '-'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route element={<RequireOnboarding />}>
          <Route path="/dashboard" element={<DashboardPlaceholder />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
