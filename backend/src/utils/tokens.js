import jwt from 'jsonwebtoken';

export const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id, orgId: user.orgId, role: user.role, plan: user.plan || 'standard' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

export const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
