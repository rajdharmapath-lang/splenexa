import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import MainTabs from './MainTabs';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpVerificationScreen from '../screens/auth/OtpVerificationScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';
import SplashScreen from '../screens/auth/SplashScreen';

export default function AppNavigator({ onNotificationPress }) {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [userState, setUserState] = useState('');
  const [batchYear, setBatchYear] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setCurrentScreen('login'), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentScreen !== 'otp' && currentScreen !== 'profile') {
      return undefined;
    }

    const previousScreen = currentScreen === 'otp' ? 'login' : 'otp';
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setCurrentScreen(previousScreen);
      return true;
    });
    return () => subscription.remove();
  }, [currentScreen]);

  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        demoMode
        initialPhoneNumber={phoneNumber.replace(/^\+91/, '')}
        onGetOtp={(value) => {
          setPhoneNumber(`+91${value}`);
          setCurrentScreen('otp');
        }}
      />
    );
  }

  if (currentScreen === 'otp') {
    return (
      <OtpVerificationScreen
        demoMode
        phoneNumber={phoneNumber}
        onBack={() => setCurrentScreen('login')}
        onVerify={() => setCurrentScreen('profile')}
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <ProfileSetupScreen
        demoMode
        onBack={() => setCurrentScreen('otp')}
        onComplete={({ name, state, batchYear: selectedBatchYear }) => {
          setUserName(name);
          setUserState(state);
          setBatchYear(selectedBatchYear);
          setCurrentScreen('home');
        }}
      />
    );
  }

  return (
    <MainTabs
      userName={userName}
      phoneNumber={phoneNumber}
      userState={userState}
      batchYear={batchYear}
      onNotificationPress={onNotificationPress}
      onSignOut={() => {
        setUserName('');
        setUserState('');
        setBatchYear('');
        setPhoneNumber('');
        setCurrentScreen('login');
      }}
    />
  );
}
