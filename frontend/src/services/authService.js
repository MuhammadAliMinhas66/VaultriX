import api from './api.js';
import { toApiError } from './apiError.js';

export const signup = async (payload) => {
  try {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const login = async (payload) => {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // logout failing quietly is fine, the session will expire on its own
  }
};

export const refresh = async () => {
  try {
    const { data } = await api.post('/auth/refresh');
    return data;
  } catch (error) {
    return null;
  }
};

export const me = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const googleAuth = async (idToken) => {
  try {
    const { data } = await api.post('/auth/google', { idToken });
    return data;
  } catch (error) {
    throw toApiError(error, 'auth.googleFailed');
  }
};
