import InputField from './InputField';

export default function OtpInput(props) {
  return (
    <InputField
      accessibilityLabel="One-time password"
      autoComplete="sms-otp"
      keyboardType="number-pad"
      maxLength={6}
      textContentType="oneTimeCode"
      {...props}
    />
  );
}
