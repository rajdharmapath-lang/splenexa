import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import { retryPhoneOtp } from '../services/authService';
import ThemedAlert from '../components/ThemedAlert';

export default function AuthStack() {
  const { requestOtp, verifyOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [alert, setAlert] = useState(null);

  const withAlert = (screen) => (
    <>
      {screen}
      <ThemedAlert
        visible={alert !== null}
        title={alert?.title}
        message={alert?.message}
        actions={[{ label: 'OK', variant: 'primary', onPress: () => setAlert(null) }]}
        onRequestClose={() => setAlert(null)}
      />
    </>
  );

  async function handleRequestOtp(value) {
    const formattedPhoneNumber = `+91${value}`;
    try {
      const pendingRequestId = await requestOtp(formattedPhoneNumber);
      setPhoneNumber(formattedPhoneNumber);
      setRequestId(pendingRequestId);
      setShowOtp(true);
    } catch (error) {
      setAlert({ title: 'Unable to send code', message: error.message });
    }
  }

  async function handleVerifyOtp(token) {
    await verifyOtp(phoneNumber, token, requestId);
  }

  async function handleResendOtp() {
    const nextRequestId = await retryPhoneOtp(phoneNumber, requestId);
    setRequestId(nextRequestId);
  }

  if (showOtp) {
    return withAlert(
      <OtpVerificationScreen
        onBack={() => setShowOtp(false)}
        onResendOtp={handleResendOtp}
        onVerify={handleVerifyOtp}
        onShowAlert={(title, message) => setAlert({ title, message })}
        phoneNumber={phoneNumber}
        key={requestId}
      />,
    );
  }

  return withAlert(
    <LoginScreen
      initialPhoneNumber={phoneNumber.replace(/^\+91/, '')}
      onGetOtp={handleRequestOtp}
    />,
  );
}
