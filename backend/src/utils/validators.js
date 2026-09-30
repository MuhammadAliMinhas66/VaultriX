const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password12', 'password123', 'password1234', 'passw0rd', 'p@ssw0rd', 'p@ssword1',
  '12345678', '123456789', '1234567890', '123123123', '11111111', '00000000', '87654321', '12341234',
  'qwerty123', 'qwertyuiop', 'qwerty12', 'qwerty1234', 'qwertyui', '1q2w3e4r', '1q2w3e4r5t', 'q1w2e3r4',
  'abc12345', 'abcd1234', 'abcdefgh', 'abcdefg1', 'iloveyou', 'iloveyou1', 'welcome1', 'welcome123',
  'admin123', 'admin1234', 'administrator', 'letmein123', 'monkey123', 'dragon123', 'football1', 'baseball1',
  'sunshine1', 'princess1', 'superman1', 'trustno1', 'changeme', 'changeme1', 'default123', 'test1234',
  'pakistan123', 'pakistan1', 'lahore123', 'karachi123', 'vaultrix', 'vaultrix1', 'vaultrix123', 'minhas123',
  'passwordpassword', 'asdfghjk', 'asdf1234', 'zxcvbnm1', 'zxcvbnm123', 'master123', 'shadow123', 'freedom1',
]);

export const PASSWORD_MESSAGES = {
  tooShort: 'Password needs to be at least 8 characters.',
  tooLong: 'Password is too long. Use 64 characters or fewer.',
  needsMix: 'Password must include at least one letter and one number.',
  tooWeak: 'That password is too easy to guess. Choose a stronger one.',
};

export const NAME_MESSAGE = 'Enter a valid name between 2 and 60 characters.';

export const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

export const validatePassword = (password, { email = '', name = '' } = {}) => {
  if (typeof password !== 'string') return PASSWORD_MESSAGES.tooShort;
  if (password.length < 8) return PASSWORD_MESSAGES.tooShort;
  if (password.length > 64 || Buffer.byteLength(password, 'utf8') > 72) return PASSWORD_MESSAGES.tooLong;
  if (!/\p{L}/u.test(password) || !/\p{N}/u.test(password)) return PASSWORD_MESSAGES.needsMix;

  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) return PASSWORD_MESSAGES.tooWeak;
  if (/^(.)\1+$/u.test(password)) return PASSWORD_MESSAGES.tooWeak;

  const localPart = String(email).split('@')[0].toLowerCase();
  if (localPart.length >= 4 && lower.includes(localPart)) return PASSWORD_MESSAGES.tooWeak;

  const compactName = String(name).toLowerCase().replace(/\s+/g, '');
  if (compactName.length >= 4 && lower.includes(compactName)) return PASSWORD_MESSAGES.tooWeak;

  return null;
};

export const cleanName = (raw) => {
  if (typeof raw !== 'string') return null;
  const value = raw.replace(/\s+/g, ' ').trim();
  if (value.length < 2 || value.length > 60) return null;
  if (/[<>{}[\]\\/$`\u0000-\u001f\u007f]/u.test(value)) return null;
  return value;
};

export const isCountryCode = (value) => typeof value === 'string' && /^[A-Z]{2}$/.test(value);
export const isCurrencyCode = (value) => typeof value === 'string' && /^[A-Z]{3}$/.test(value);
