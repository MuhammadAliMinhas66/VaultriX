const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500
    ? 'Something went wrong on our end. Please try again in a moment.'
    : err.message || 'That action could not be completed.';

  res.status(status).json({ success: false, message });
};

export default errorHandler;
