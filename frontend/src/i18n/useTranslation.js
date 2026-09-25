import { useAuth } from '../context/AuthContext.jsx';
import { translations } from './translations.js';

import { getStoredLanguage } from './languageStorage.js';
export { getStoredLanguage, setStoredLanguage } from './languageStorage.js';

const interpolate = (template, vars) => {
  if (!vars) return template;
  return Object.keys(vars).reduce((acc, key) => acc.replaceAll(`{${key}}`, vars[key]), template);
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
};

export function useTranslation() {
  const { user } = useAuth();
  const language = user?.language || getStoredLanguage() || 'en';
  const dict = translations[language] || translations.en;

  const t = (key, vars) => {
    const template = dict[key] || translations.en[key] || key;
    return interpolate(template, vars);
  };

  const tServer = (message) => {
    if (!message) return message;
    const key = SERVER_MESSAGE_KEYS[message];
    return key ? t(key) : message;
  };

  return { t, tServer, language };
}
