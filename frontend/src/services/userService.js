import api from './api.js';

const extractMessage = (error, fallback) => error.response?.data?.message || fallback;

export const updateProfile = async (payload) => {
  try {
    const { data } = await api.patch('/users/me', payload);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Could not save your changes right now. Please try again.'));
  }
};

export const changePassword = async (payload) => {
  try {
    const { data } = await api.post('/users/me/password', payload);
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Could not update your password right now. Please try again.'));
  }
};

export const uploadAvatar = async (file) => {
  try {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.post('/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error) {
    throw new Error(extractMessage(error, 'Could not upload that image right now. Please try again.'));
  }
};
