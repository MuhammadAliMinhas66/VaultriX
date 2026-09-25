const STORAGE_KEY = 'vaultrix_language';

export const getStoredLanguage = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch (error) {
    return '';
  }
};

export const setStoredLanguage = (language) => {
  try {
    if (language) localStorage.setItem(STORAGE_KEY, language);
  } catch (error) {
    // storage can be unavailable in private browsing, the UI still works without it
  }
};
