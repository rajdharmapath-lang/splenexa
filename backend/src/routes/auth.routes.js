const express = require('express');
const { rateLimit } = require('express-rate-limit');
const authController = require('../controllers/auth.controller');

const router = express.Router();
const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many OTP attempts. Please wait and try again.' },
});

router.post('/send-otp', otpRateLimit, authController.sendOtp);
router.post('/retry-otp', otpRateLimit, authController.retryOtp);
router.post('/verify-otp', otpRateLimit, authController.verifyOtp);

module.exports = router;
