import { translations } from './translations.js';
export const DEFAULT_LANGUAGE = 'en';

// A language is an application language only if a dictionary exists for it.
export const isSupportedLanguage = (code) =>
  typeof code === 'string' && Object.prototype.hasOwnProperty.call(translations, code);

// Anything unknown or missing (new account, legacy value such as "ko") is English.
export const resolveLanguage = (code) => (isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE);

const interpolate = (template, vars) => {
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, key) => acc.replaceAll(`{${key}}`, vars[key]), template);
};

export const translate = (language, key, vars) => {
  const dict = translations[language] || translations[DEFAULT_LANGUAGE];
  const template = dict[key] || translations[DEFAULT_LANGUAGE][key] || key;
  return interpolate(template, vars);
};

const SERVER_MESSAGE_KEYS = {
  'An account with this email already exists.': 'errors.duplicateEmail',
  'An account with this email already exists. Try signing in instead.': 'errors.emailExistsSignIn',
  'Choose an image to upload.': 'errors.chooseImage',
  'Could not read your Google account details.': 'errors.googleReadFailed',
  'Enter your current password and a new password.': 'errors.enterCurrentAndNew',
  'Enter your email and password to continue.': 'errors.enterCredentials',
  'Google sign-in did not send back a token.': 'errors.googleNoToken',
  'Name, email and password are all required.': 'errors.signupRequired',
  'New password needs to be at least 8 characters.': 'errors.newPasswordTooShort',
  'Password needs to be at least 8 characters.': 'errors.passwordTooShort',
  'Please sign in again.': 'errors.signInAgain',
  'Please sign in to continue.': 'errors.signInContinue',
  'That email or password is not right.': 'errors.wrongCredentials',
  'That image is too large. Please choose one under 3MB.': 'errors.imageTooLarge',
  'This account signs in with Google and does not have a password to change.': 'errors.googleNoPasswordChange',
  'This account was created with Google. Use the Google sign-in button instead.': 'errors.googleUseButton',
  'You do not have access to this.': 'errors.noAccess',
  'Your current password is not right.': 'errors.currentPasswordWrong',
  'Your name cannot be empty.': 'errors.nameEmpty',
  'Your session has expired. Please sign in again.': 'errors.sessionExpired',
  'Something went wrong on our end. Please try again in a moment.': 'errors.somethingWrong',
  'That action could not be completed.': 'errors.actionFailed',
  'That record already exists. Check the details and try again.': 'errors.recordExists',
  'Some of the details look incomplete. Check the form and try again.': 'errors.detailsIncomplete',
  'Please upload a JPG, PNG or WEBP image.': 'errors.uploadImageType',
  'That language is not supported.': 'errors.languageUnsupported',
};

export const serverMessageKey = (error) =>
  SERVER_MESSAGE_KEYS[typeof error === 'string' ? error : error?.message] || null;

export const translateError = (language, error) => {
  const known = serverMessageKey(error);
  if (known) return translate(language, known);
  if (error?.isNetwork) return translate(language, 'errors.network');
  if (error?.status === 429) return translate(language, 'errors.tooManyRequests');
  return translate(language, error?.fallbackKey || 'errors.somethingWrong');
};
