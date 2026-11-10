const jwt = require('jsonwebtoken');
const userRepository = require('../db/user.repository');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    const error = new Error('JWT_SECRET must be configured with at least 32 bytes.');
    error.code = 'JWT_NOT_CONFIGURED';
    throw error;
  }
  return secret;
}

function issueSessionToken(userId) {
  return jwt.sign({ purpose: 'session', userId }, getJwtSecret(), { expiresIn: '30d' });
}

function issueOtpRequestToken(identifier, providerRequestId) {
  return jwt.sign(
    { purpose: 'msg91_otp_request', identifier, providerRequestId },
    getJwtSecret(),
    { expiresIn: '10m' },
  );
}

function readOtpRequestToken(token, identifier) {
  const secret = getJwtSecret();
  try {
    const payload = jwt.verify(token, secret);
    if (
      payload.purpose !== 'msg91_otp_request' ||
      payload.identifier !== identifier ||
      typeof payload.providerRequestId !== 'string'
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

async function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (payload.purpose !== 'session' || typeof payload.userId !== 'string') {
      return res.status(401).json({ message: 'Invalid or expired session.' });
    }
    const user = await userRepository.getUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ message: 'Account not found.' });
    }
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired session.' });
    }
    return next(error);
  }
}

module.exports = {
  getJwtSecret,
  issueSessionToken,
  issueOtpRequestToken,
  readOtpRequestToken,
  requireAuth,
};
