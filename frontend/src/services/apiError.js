export class ApiError extends Error {
  constructor(message, { status = 0, isNetwork = false, fallbackKey = 'errors.somethingWrong' } = {}) {
    super(message || '');
    this.name = 'ApiError';
    this.status = status;
    this.isNetwork = isNetwork;
    this.fallbackKey = fallbackKey;
  }
}

export const toApiError = (error, fallbackKey) =>
  new ApiError(error.response?.data?.message || '', {
    status: error.response?.status || 0,
    isNetwork: !error.response,
    fallbackKey,
  });
