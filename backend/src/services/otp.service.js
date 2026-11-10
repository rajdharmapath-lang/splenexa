const msg91 = require('./msg91.client');
const {
  getJwtSecret,
  issueOtpRequestToken,
  readOtpRequestToken,
} = require('../middleware/auth.middleware');

function normalizePhone(dialCode, phone) {
  const countryDigits = String(dialCode || '').replace(/\D/g, '');
  const phoneDigits = String(phone || '').replace(/\D/g, '');
  const identifier = `${countryDigits}${phoneDigits}`;
  if (
    !countryDigits ||
    phoneDigits.length < 6 ||
    identifier.length < 8 ||
    identifier.length > 15
  ) {
    return null;
  }
  return identifier;
}

function getOtpRequest(requestId, dialCode, phone) {
  const identifier = normalizePhone(dialCode, phone);
  if (!identifier || typeof requestId !== 'string') {
    return null;
  }
  const claims = readOtpRequestToken(requestId, identifier);
  return claims ? { identifier, claims } : null;
}

async function generateOtp(dialCode, phone) {
  const identifier = normalizePhone(dialCode, phone);
  if (!identifier) {
    const error = new Error('Enter a valid phone number.');
    error.code = 'INVALID_PHONE';
    throw error;
  }
  getJwtSecret();
  const providerRequestId = await msg91.sendOtp(identifier);
  return issueOtpRequestToken(identifier, providerRequestId);
}

async function retryOtp(dialCode, phone, requestId, retryChannel) {
  const request = getOtpRequest(requestId, dialCode, phone);
  if (!request) {
    return false;
  }
  await msg91.retryOtp(request.claims.providerRequestId, retryChannel);
  return true;
}

async function verifyOtp(dialCode, phone, code, requestId) {
  const request = getOtpRequest(requestId, dialCode, phone);
  if (!request || !/^\d{4,8}$/.test(String(code || ''))) {
    return false;
  }
  return msg91.verifyOtp(request.claims.providerRequestId, String(code));
}

module.exports = { normalizePhone, generateOtp, retryOtp, verifyOtp };
