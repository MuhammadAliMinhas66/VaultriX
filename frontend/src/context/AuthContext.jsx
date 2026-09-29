import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { refresh as refreshSession, logout as logoutRequest } from '../services/authService.js';
import { setAuthToken, setUnauthorizedHandler } from '../services/api.js';
import {
  getGuestLanguage,
  setGuestLanguage as storeGuestLanguage,
  purgeLegacyPreferenceKeys,
} from '../i18n/languageStorage.js';
import { resolveLanguage, isSupportedLanguage, translate } from '../i18n/translate.js';
import { notify } from '../i18n/notifications.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // One-time cleanup of the old cross-account localStorage keys (runs once per page load).
  useState(purgeLegacyPreferenceKeys);

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  // Language for signed-out screens only (login / signup). Never used once signed in.
  const [guestLanguage, setGuestLanguageState] = useState(() => resolveLanguage(getGuestLanguage()));

  // SINGLE SOURCE OF TRUTH for the application language. It is derived, never
  // copied into a second state variable:
  //   signed in  -> this account's saved language, English if none/unsupported
  //   signed out -> the guest language (English by default)
  // It only changes when the account record changes (Update preferences,
  // onboarding) or when the session changes, so it cannot go stale or leak.
  const language = user ? resolveLanguage(user.language) : guestLanguage;
  const currency = user?.currency || '';

  const languageRef = useRef(language);
  const hadSessionRef = useRef(false);

  const setSession = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setAuthToken(data.accessToken);
    hadSessionRef.current = true;
  };

  const clearSession = () => {
    hadSessionRef.current = false;
    setUser(null);
    setAccessToken(null);
    setAuthToken(null);
  };

  const updateUser = (partialUser) => {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : prev));
  };

  const setGuestLanguage = (code) => {
    if (!isSupportedLanguage(code)) return;
    setGuestLanguageState(code);
    storeGuestLanguage(code);
  };

  const signOut = async () => {
    await logoutRequest();
    notify.info(translate(languageRef.current, 'info.signedOut'));
    clearSession();
  };

  useEffect(() => {
    languageRef.current = language;
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!hadSessionRef.current) return;
      notify.warning(translate(languageRef.current, 'errors.sessionExpired'));
      clearSession();
    });

    let cancelled = false;

    (async () => {
      const data = await refreshSession();
      if (cancelled) return;
      if (data) {
        setSession(data);
      }
      setIsBootstrapping(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isBootstrapping,
    language,
    currency,
    setGuestLanguage,
    setSession,
    clearSession,
    updateUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
