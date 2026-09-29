import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { refresh as refreshSession, logout as logoutRequest } from '../services/authService.js';
import { setAuthToken, setUnauthorizedHandler } from '../services/api.js';
import {
  getStoredLanguage,
  setStoredLanguage,
  getStoredCurrency,
  setStoredCurrency,
} from '../i18n/languageStorage.js';
import { detectBrowserLanguage, isSupportedLanguage, translate } from '../i18n/translate.js';
import { notify } from '../i18n/notifications.js';

const AuthContext = createContext(null);

const initialLanguage = () => {
  const stored = getStoredLanguage();
  return isSupportedLanguage(stored) ? stored : detectBrowserLanguage();
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [language, setLanguageState] = useState(initialLanguage);
  const [currency, setCurrencyState] = useState(() => getStoredCurrency());

  const languageRef = useRef(language);
  const hadSessionRef = useRef(false);

  const setSession = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setAuthToken(data.accessToken);
    hadSessionRef.current = true;

    // Only adopt the account's saved language/currency when this browser has no
    // local preference yet (first sign-in on a new device). If the person already
    // picked something here - saved or not - that local choice always wins, so a
    // stale server value never stomps a live selection on login or refresh.
    if (!getStoredLanguage() && data.user?.language) {
      setLanguage(data.user.language);
    }
    if (!getStoredCurrency() && data.user?.currency) {
      setCurrency(data.user.currency);
    }
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

  const setLanguage = (code) => {
    if (!isSupportedLanguage(code)) return;
    setLanguageState(code);
    setStoredLanguage(code);
  };

  const setCurrency = (code) => {
    if (!code) return;
    setCurrencyState(code);
    setStoredCurrency(code);
  };

  const signOut = async () => {
    await logoutRequest();
    clearSession();
    notify.info(translate(languageRef.current, 'info.signedOut'));
  };

  useEffect(() => {
    languageRef.current = language;
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!hadSessionRef.current) return;
      clearSession();
      notify.warning(translate(languageRef.current, 'errors.sessionExpired'));
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
    setLanguage,
    setCurrency,
    setSession,
    clearSession,
    updateUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
