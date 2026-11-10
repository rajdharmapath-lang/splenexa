const userRepository = require('../db/user.repository');
const { issueSessionToken } = require('../middleware/auth.middleware');
const otpService = require('../services/otp.service');

function hasValidPhone(body) {
  return Boolean(
    body &&
    typeof body.phone === 'string' &&
    typeof body.dialCode === 'string' &&
    otpService.normalizePhone(body.dialCode, body.phone)
  );
}

async function sendOtp(req, res, next) {
  if (!hasValidPhone(req.body)) {
    return res.status(400).json({ message: 'Enter a valid phone number and dial code.' });
  }
  try {
    const requestId = await otpService.generateOtp(req.body.dialCode, req.body.phone);
    return res.json({ success: true, requestId });
  } catch (error) {
    if (error.code === 'MSG91_NOT_CONFIGURED' || error.code === 'JWT_NOT_CONFIGURED') {
      return res.status(503).json({ message: error.message });
    }
    if (error.code?.startsWith('MSG91_')) {
      console.error('MSG91 send OTP failed:', error.code);
      return res.status(502).json({ message: 'Could not send the verification code.' });
    }
    return next(error);
  }
}

async function retryOtp(req, res, next) {
  const { phone, dialCode, requestId, retryChannel } = req.body || {};
  if (!hasValidPhone(req.body) || typeof requestId !== 'string' || !requestId) {
    return res.status(400).json({ message: 'Phone, dial code, and OTP request are required.' });
  }
  if (retryChannel !== undefined && (typeof retryChannel !== 'string' || retryChannel.length > 30)) {
    return res.status(400).json({ message: 'Invalid OTP retry channel.' });
  }
  try {
    const retried = await otpService.retryOtp(dialCode, phone, requestId, retryChannel);
    if (!retried) {
      return res.status(400).json({ message: 'OTP request expired. Request a new code.' });
    }
    return res.json({ success: true, requestId });
  } catch (error) {
    if (error.code === 'MSG91_NOT_CONFIGURED' || error.code === 'JWT_NOT_CONFIGURED') {
      return res.status(503).json({ message: error.message });
    }
    if (error.code?.startsWith('MSG91_')) {
      console.error('MSG91 retry OTP failed:', error.code);
      return res.status(502).json({ message: 'Could not resend the verification code.' });
    }
    return next(error);
  }
}

async function verifyOtp(req, res, next) {
  const { phone, dialCode, code, requestId } = req.body || {};
  if (
    !hasValidPhone(req.body) ||
    typeof requestId !== 'string' ||
    !requestId ||
    !/^\d{4,8}$/.test(String(code || ''))
  ) {
    return res.status(400).json({ message: 'Phone, dial code, request, and valid OTP are required.' });
  }

  try {
    const isValid = await otpService.verifyOtp(dialCode, phone, code, requestId);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid or expired verification code.' });
    }
  } catch (error) {
    if (error.code === 'MSG91_NOT_CONFIGURED' || error.code === 'JWT_NOT_CONFIGURED') {
      return res.status(503).json({ message: error.message });
    }
    if (error.code?.startsWith('MSG91_')) {
      console.error('MSG91 verify OTP failed:', error.code);
      return res.status(502).json({ message: 'Could not verify the code.' });
    }
    return next(error);
  }

  try {
    const normalizedDialCode = dialCode.replace(/\D/g, '');
    const normalizedPhone = phone.replace(/\D/g, '');
    const account = await userRepository.getOrCreateUserByPhone(normalizedDialCode, normalizedPhone);
    const token = issueSessionToken(account.user.id);
    return res.json({
      token,
      user: account.user,
      isNewUser: account.created,
    });
  } catch (error) {
    if (error.code === 'SUPABASE_NOT_CONFIGURED' || error.code === 'JWT_NOT_CONFIGURED') {
      return res.status(503).json({ message: error.message });
    }
    console.error('Account creation after OTP failed:', error.code || error.message);
    return res.status(503).json({ message: 'Could not create your account.' });
  }
}

module.exports = { sendOtp, retryOtp, verifyOtp };
