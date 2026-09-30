import jwt from 'jsonwebtoken';

export const signAccessToken = (user) =>
  jwt.sign(
    { sub: user._id, orgId: user.orgId, role: user.role, plan: user.plan || 'standard', tv: user.tokenVersion || 0 },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
  );

export const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id, tokenVersion: user.tokenVersion || 0 }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
    algorithm: 'HS256',
  });

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] });

export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });

const resetSecret = () => `${process.env.JWT_ACCESS_SECRET}:password-reset`;

export const signResetToken = ({ sub, nonce }) =>
  jwt.sign({ sub, nonce, purpose: 'password-reset' }, resetSecret(), { expiresIn: '10m', algorithm: 'HS256' });

export const verifyResetToken = (token) => {
  const payload = jwt.verify(token, resetSecret(), { algorithms: ['HS256'] });
  if (payload.purpose !== 'password-reset') {
    throw new Error('Wrong token purpose');
  }
  return payload;
};
