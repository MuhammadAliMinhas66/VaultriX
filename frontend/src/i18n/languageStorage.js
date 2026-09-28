const LANGUAGE_KEY = 'vaultrix_language';
const CURRENCY_KEY = 'vaultrix_currency';

const read = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch (error) {
    return '';
  }
};

const write = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value);
  } catch (error) {
    // storage can be unavailable in private browsing, the UI still works without it
  }
};

export const getStoredLanguage = () => read(LANGUAGE_KEY);
export const setStoredLanguage = (language) => write(LANGUAGE_KEY, language);
export const getStoredCurrency = () => read(CURRENCY_KEY);
export const setStoredCurrency = (currency) => write(CURRENCY_KEY, currency);
