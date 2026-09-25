import { useAuth } from '../context/AuthContext.jsx';
import { translations } from './translations.js';

const interpolate = (template, vars) => {
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, key) => acc.replaceAll(`{${key}}`, vars[key]), template);
};

export function useTranslation() {
  const { user } = useAuth();
  const language = user?.language || 'en';
  const dict = translations[language] || translations.en;

  const t = (key, vars) => {
    const template = dict[key] || translations.en[key] || key;
    return interpolate(template, vars);
  };

  return { t, language };
}
