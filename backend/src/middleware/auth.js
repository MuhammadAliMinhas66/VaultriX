import { verifyAccessToken } from '../utils/tokens.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      orgId: payload.orgId,
      role: payload.role,
      plan: payload.plan,
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have access to this.' });
  }
  next();
};
