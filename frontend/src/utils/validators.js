export function isValidPhoneNumber(phoneNumber) {
  return /^[6-9]\d{9}$/.test(phoneNumber);
}

export function isValidOtp(otp) {
  return /^\d{6}$/.test(otp);
}
