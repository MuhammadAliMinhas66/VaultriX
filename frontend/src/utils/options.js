export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'Urdu, \u0627\u0631\u062f\u0648' },
  { value: 'ar', label: 'Arabic, \u0627\u0644\u0639\u0631\u0628\u064a\u0629' },
  { value: 'hi', label: 'Hindi, \u0939\u093f\u0928\u094d\u0926\u0940' },
  { value: 'es', label: 'Spanish, Espa\u00f1ol' },
  { value: 'fr', label: 'French, Fran\u00e7ais' },
  { value: 'de', label: 'German, Deutsch' },
  { value: 'pt', label: 'Portuguese, Portugu\u00eas' },
  { value: 'ru', label: 'Russian, \u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { value: 'zh', label: 'Chinese, \u4e2d\u6587' },
  { value: 'ja', label: 'Japanese, \u65e5\u672c\u8a9e' },
  { value: 'ko', label: 'Korean, \ud55c\uad6d\uc5b4' },
  { value: 'tr', label: 'Turkish, T\u00fcrk\u00e7e' },
  { value: 'it', label: 'Italian, Italiano' },
  { value: 'bn', label: 'Bengali, \u09ac\u09be\u0982\u09b2\u09be' },
  { value: 'id', label: 'Indonesian, Bahasa Indonesia' },
  { value: 'vi', label: 'Vietnamese, Ti\u1ebfng Vi\u1ec7t' },
  { value: 'th', label: 'Thai, \u0e44\u0e17\u0e22' },
  { value: 'fa', label: 'Persian, \u0641\u0627\u0631\u0633\u06cc' },
  { value: 'pa', label: 'Punjabi, \u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40' },
  { value: 'sw', label: 'Swahili, Kiswahili' },
  { value: 'pl', label: 'Polish, Polski' },
  { value: 'nl', label: 'Dutch, Nederlands' },
  { value: 'el', label: 'Greek, \u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac' },
  { value: 'he', label: 'Hebrew, \u05e2\u05d1\u05e8\u05d9\u05ea' },
  { value: 'uk', label: 'Ukrainian, \u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430' },
  { value: 'ms', label: 'Malay, Bahasa Melayu' },
  { value: 'tl', label: 'Filipino, Tagalog' },
  { value: 'ne', label: 'Nepali, \u0928\u0947\u092a\u093e\u0932\u0940' },
  { value: 'ps', label: 'Pashto, \u067e\u069a\u062a\u0648' },
];

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '\u20ac' },
  { value: 'GBP', label: 'British Pound', symbol: '\u00a3' },
  { value: 'PKR', label: 'Pakistani Rupee', symbol: '\u20a8' },
  { value: 'INR', label: 'Indian Rupee', symbol: '\u20b9' },
  { value: 'AED', label: 'UAE Dirham', symbol: '\u062f.\u0625' },
  { value: 'SAR', label: 'Saudi Riyal', symbol: '\ufdfc' },
  { value: 'CNY', label: 'Chinese Yuan', symbol: '\u00a5' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '\u00a5' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: '$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: '$' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'Fr' },
  { value: 'TRY', label: 'Turkish Lira', symbol: '\u20ba' },
  { value: 'ZAR', label: 'South African Rand', symbol: 'R' },
  { value: 'NGN', label: 'Nigerian Naira', symbol: '\u20a6' },
  { value: 'BDT', label: 'Bangladeshi Taka', symbol: '\u09f3' },
  { value: 'IDR', label: 'Indonesian Rupiah', symbol: 'Rp' },
  { value: 'MYR', label: 'Malaysian Ringgit', symbol: 'RM' },
  { value: 'SGD', label: 'Singapore Dollar', symbol: '$' },
  { value: 'KRW', label: 'South Korean Won', symbol: '\u20a9' },
  { value: 'RUB', label: 'Russian Ruble', symbol: '\u20bd' },
  { value: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { value: 'MXN', label: 'Mexican Peso', symbol: '$' },
  { value: 'EGP', label: 'Egyptian Pound', symbol: '\u00a3' },
  { value: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
  { value: 'QAR', label: 'Qatari Riyal', symbol: '\ufdfc' },
  { value: 'KWD', label: 'Kuwaiti Dinar', symbol: '\u062f.\u0643' },
];

export const formatCurrency = (amountInMajorUnits, currencyCode, locale = 'en') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode }).format(
      amountInMajorUnits
    );
  } catch (error) {
    return `${currencyCode} ${amountInMajorUnits.toFixed(2)}`;
  }
};
