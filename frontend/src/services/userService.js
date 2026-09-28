import api from './api.js';
import { toApiError } from './apiError.js';

export const updateProfile = async (payload) => {
  try {
    const { data } = await api.patch('/users/me', payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const changePassword = async (payload) => {
  try {
    const { data } = await api.post('/users/me/password', payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
};

export const uploadAvatar = async (file) => {
  try {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return data;
  } catch (error) {
    throw toApiError(error);
  }
};
