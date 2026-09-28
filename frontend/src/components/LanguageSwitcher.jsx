import Combobox from './Combobox.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTranslation } from '../i18n/useTranslation.js';
import { useLocalizedOptions } from '../i18n/useLocalizedOptions.js';

function LanguageSwitcher() {
  const { language, setLanguage } = useAuth();
  const { t } = useTranslation();
  const { languages } = useLocalizedOptions();

  return (
    <Combobox
      ariaLabel={t('dashboard.language')}
      items={languages}
      value={language}
      onChange={setLanguage}
      placeholder={t('combobox.searchLanguages')}
      className="w-52"
      menuClassName="right-0 w-72 max-w-[calc(100vw-2rem)]"
    />
  );
}

export default LanguageSwitcher;
