import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import GlassCard, { glassCardEffects } from '../../components/GlassCard';
import ThemedAlert from '../../components/ThemedAlert';

const OTP_LENGTH = 6;
const RESEND_DELAY = 29;
const NAVY = '#100568';

export default function OtpVerificationScreen({
  phoneNumber = '',
  onBack,
  onResendOtp,
  onVerify,
  onShowAlert,
  demoMode = false,
}) {
  const insets = useSafeAreaInsets();
  const inputRefs = useRef([]);
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorDialog, setErrorDialog] = useState(null);
  const otp = digits.join('');
  const isOtpComplete = demoMode || digits.every(Boolean);
  const displayPhoneNumber = '+91 XXXX XXXX';

  useEffect(() => {
    if (countdown === 0) {
      return undefined;
    }

    const timer = setTimeout(() => setCountdown((remaining) => remaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleDigitChange(index, value) {
    const enteredDigits = value.replace(/\D/g, '');
    const nextDigits = [...digits];

    if (!enteredDigits) {
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    enteredDigits
      .slice(0, OTP_LENGTH - index)
      .split('')
      .forEach((digit, offset) => {
        nextDigits[index + offset] = digit;
      });

    setDigits(nextDigits);

    const nextIndex = Math.min(index + enteredDigits.length, OTP_LENGTH - 1);
    if (index + enteredDigits.length >= OTP_LENGTH) {
      inputRefs.current[OTP_LENGTH - 1]?.blur();
    } else {
      inputRefs.current[nextIndex]?.focus();
    }
  }

  function handleKeyPress(index, key) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleResend() {
    if (countdown > 0 || isResending) {
      return;
    }
    setIsResending(true);
    try {
      await onResendOtp?.();
      setDigits(Array(OTP_LENGTH).fill(''));
      setCountdown(RESEND_DELAY);
      inputRefs.current[0]?.focus();
    } catch (error) {
      if (onShowAlert) {
        onShowAlert('Unable to resend code', error.message);
      } else {
        setErrorDialog({ title: 'Unable to resend code', message: error.message });
      }
    } finally {
      setIsResending(false);
    }
  }

  async function handleVerify() {
    if (!isOtpComplete || isVerifying) {
      return;
    }
    setIsVerifying(true);
    try {
      await onVerify?.(otp);
    } catch (error) {
      if (onShowAlert) {
        onShowAlert('Unable to verify code', error.message);
      } else {
        setErrorDialog({ title: 'Unable to verify code', message: error.message });
      }
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <LinearGradient
      colors={['#B0E9FD', '#BDF0FD', '#C7F9F8', '#C5FCEF', '#C2FCEC']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.screen}
    >
      <StatusBar hidden />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 58 },
        ]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <GlassCard
          {...glassCardEffects}
          radius={32}
          style={styles.card}
          contentStyle={styles.cardContent}
        >
          <Text style={styles.heading}>Verification</Text>
          <Text style={styles.instruction}>Enter the 6-digit code sent to</Text>

          <View style={styles.phoneRow}>
            <Image
              source={require('../../assets/images/whatsapp-icon.png')}
              style={styles.whatsappIcon}
              accessibilityLabel="WhatsApp"
            />
            <Text accessibilityLabel={`Code sent to ${displayPhoneNumber}`} style={styles.phoneNumber}>
              {displayPhoneNumber}
            </Text>
          </View>

          <View style={styles.otpRow}>
            {digits.map((digit, index) => {
              const focused = focusedIndex === index;
              return (
                <GlassCard
                  {...glassCardEffects}
                  key={index}
                  radius={14}
                  style={styles.otpBox}
                  contentStyle={styles.otpBoxContent}
                >
                  {focused ? (
                    <View
                      pointerEvents="none"
                      style={[StyleSheet.absoluteFill, styles.otpFocusRing]}
                    />
                  ) : null}
                  <TextInput
                    ref={(input) => {
                      inputRefs.current[index] = input;
                    }}
                    accessibilityLabel={`OTP digit ${index + 1}`}
                    autoComplete={index === 0 ? 'sms-otp' : 'off'}
                    keyboardType="number-pad"
                    maxLength={OTP_LENGTH}
                    onChangeText={(value) => handleDigitChange(index, value)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex((current) => (current === index ? -1 : current))}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                    selectTextOnFocus
                    selectionColor="#009DC5"
                    style={styles.otpInput}
                    textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                    value={digit}
                  />
                </GlassCard>
              );
            })}
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.countdown}>
              Resend OTP  0:{String(countdown).padStart(2, '0')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: countdown > 0 || isResending }}
              disabled={countdown > 0 || isResending}
              onPress={handleResend}
              style={styles.resendButton}
            >
              <Text style={[styles.resendText, (countdown > 0 || isResending) && styles.resendDisabled]}>
                {isResending ? 'Sending…' : 'Resend'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Verify and proceed"
            accessibilityState={{ disabled: !isOtpComplete || isVerifying }}
            disabled={!isOtpComplete || isVerifying}
            onPress={handleVerify}
            style={({ pressed }) => [
              styles.buttonShadow,
              pressed && isOtpComplete && !isVerifying && styles.buttonPressed,
              (!isOtpComplete || isVerifying) && styles.buttonDisabled,
            ]}
          >
            <View style={styles.buttonBorder}>
              <LinearGradient
                colors={['#0A9BE8', '#2FD3D0', '#4FE4BA']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.verifyButton}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
                  style={styles.gloss}
                  pointerEvents="none"
                />
                <Text style={styles.verifyText}>
                  {isVerifying ? 'Continuing…' : 'Verify & Proceed'}
                </Text>
              </LinearGradient>
            </View>
          </Pressable>
        </GlassCard>
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={[styles.backButton, { top: Math.max(insets.top + 68, 92) }]}
      >
        <Feather name="arrow-left" size={34} color={NAVY} />
      </Pressable>
      <ThemedAlert
        visible={errorDialog !== null}
        title={errorDialog?.title}
        message={errorDialog?.message}
        actions={[{ label: 'OK', variant: 'primary', onPress: () => setErrorDialog(null) }]}
        onRequestClose={() => setErrorDialog(null)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { width: '100%' },
  cardContent: { padding: 24 },
  heading: {
    color: '#100568',
    fontSize: 34,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 16,
  },
  instruction: {
    color: '#5778A4',
    fontSize: 17,
    fontFamily: typography.fontFamily.regular,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 26,
  },
  whatsappIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  phoneNumber: {
    color: '#36CBAE',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  otpRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  otpBox: { flex: 1 },
  otpBoxContent: { height: 52, alignItems: 'center', justifyContent: 'center' },
  otpFocusRing: { borderRadius: 14, borderWidth: 1.5, borderColor: '#19D3D3' },
  otpInput: {
    width: '100%',
    height: '100%',
    padding: 0,
    color: '#100568',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countdown: {
    color: '#71838D',
    fontSize: 17,
    fontFamily: typography.fontFamily.regular,
  },
  resendButton: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  resendText: {
    color: '#100568',
    fontSize: 17,
    textDecorationLine: 'underline',
    fontFamily: typography.fontFamily.medium,
  },
  resendDisabled: {
    opacity: 1,
  },
  buttonShadow: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#0086A8',
    shadowColor: '#005B78',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 5,
    elevation: 7,
  },
  buttonBorder: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  verifyButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
  buttonPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  verifyText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontFamily: typography.fontFamily.semiBold,
  },
});
