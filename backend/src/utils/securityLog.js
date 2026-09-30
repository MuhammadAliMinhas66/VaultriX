export const securityLog = (event, req, details = {}) => {
  const entry = {
    time: new Date().toISOString(),
    event,
    ip: req?.ip,
    path: req?.originalUrl ? req.originalUrl.split('?')[0] : undefined,
    ...details,
  };
  console.warn('[security]', JSON.stringify(entry));
};
