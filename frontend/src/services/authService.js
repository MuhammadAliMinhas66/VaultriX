import api from './api.js';

const extractMessage = (error, fallback) =>
  error.response?.data?.message || fallback;

export const signup = async (payload) => {
  try {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Could not create your account right now. Please try again.'));
  }
};

export const login = async (payload) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Could not sign you in right now. Please try again.'));
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // logout failing quietly is fine, the session will expire on its own
  }
};

export const googleAuth = async (idToken) => {
  try {
    const { data } = await api.post('/auth/google', { idToken });
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Could not sign you in with Google right now.'));
  }
};
