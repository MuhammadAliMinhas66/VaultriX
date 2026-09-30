import User from '../models/User.js';
import { verifyAccessToken } from '../utils/tokens.js';

export const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  }

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
  }

  try {
    const user = await User.findById(payload.sub).select('orgId role plan tokenVersion');

    if (!user || (payload.tv ?? 0) !== (user.tokenVersion || 0)) {
      return res.status(401).json({ success: false, message: 'Your session has expired. Please sign in again.' });
    }

    req.user = {
      id: String(user._id),
      orgId: user.orgId,
      role: user.role,
      plan: user.plan,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'You do not have access to this.' });
  }
  next();
};
