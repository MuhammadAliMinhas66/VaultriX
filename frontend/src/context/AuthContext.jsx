import { createContext, useContext, useEffect, useState } from 'react';
import { refresh as refreshSession, logout as logoutRequest } from '../services/authService.js';
import { setAuthToken, setUnauthorizedHandler } from '../services/api.js';
import { getStoredLanguage, setStoredLanguage } from '../i18n/languageStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const setSession = (data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setAuthToken(data.accessToken);
  };

  const clearSession = () => {
    setUser(null);
    setAccessToken(null);
    setAuthToken(null);
  };

  const updateUser = (partialUser) => {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : prev));
  };

  const signOut = async () => {
    await logoutRequest();
    clearSession();
  };

  useEffect(() => {
    setUnauthorizedHandler(() => clearSession());

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

  useEffect(() => {
    const language = user?.language || getStoredLanguage() || 'en';
    document.documentElement.lang = language;
    if (user?.language) setStoredLanguage(user.language);
  }, [user?.language]);

  const value = {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isBootstrapping,
    setSession,
    clearSession,
    updateUser,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
