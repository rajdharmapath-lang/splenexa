import { useState } from 'react';
import {
  Image,
  Keyboard,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import { isValidPhoneNumber } from '../../utils/validators';
import GlassCard, { glassCardEffects } from '../../components/GlassCard';

export default function LoginScreen({ initialPhoneNumber = '', onGetOtp, demoMode = false }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logoWidth = Math.min(width * 0.58, 320);
  const isPhoneNumberValid = demoMode
    ? /^\d{10}$/.test(phoneNumber)
    : isValidPhoneNumber(phoneNumber);
  const canRequestOtp = isPhoneNumberValid && !isSubmitting;

  async function handleGetOtp() {
    if (!canRequestOtp) {
      return;
    }
    Keyboard.dismiss();
    setIsSubmitting(true);
    try {
      await onGetOtp?.(phoneNumber);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LinearGradient
      colors={['#7FD7F5', '#9BE6F7', '#A4F1F4', '#9FF9EA', '#A2FBE3']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.screen}
    >
      <StatusBar hidden />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 110 },
        ]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <Image
          source={require('../../assets/images/splenexa-logo.png')}
          resizeMode="contain"
          style={[styles.logo, { width: logoWidth, aspectRatio: 272.78 / 73.98 }]}
          accessibilityLabel="Splenexa"
        />

        <Text style={styles.welcome}>Welcome to Splenexa</Text>
        <Text style={styles.intro}>
          Enter your phone number to start{'\n'}your learning journey.
        </Text>

        <GlassCard
          {...glassCardEffects}
          radius={32}
          style={styles.card}
          contentStyle={styles.cardContent}
        >
            <Text style={styles.cardTitle}>Login</Text>
            <Text style={styles.label}>Phone number</Text>

            <GlassCard
              {...glassCardEffects}
              radius={22}
              style={styles.fieldGap}
              contentStyle={styles.phoneField}
            >
              <Text style={styles.countryCode}>+91</Text>
              <View style={styles.divider} />
              <TextInput
                accessibilityLabel="Phone number"
                autoComplete="tel"
                keyboardType="phone-pad"
                maxLength={10}
                onChangeText={(value) => setPhoneNumber(value.replace(/\D/g, ''))}
                placeholder="Enter phone number"
                placeholderTextColor="#6E8AB2"
                selectionColor="#009DC5"
                style={styles.input}
                value={phoneNumber}
              />
            </GlassCard>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Get OTP"
              accessibilityState={{ disabled: !canRequestOtp }}
              disabled={!canRequestOtp}
              onPress={handleGetOtp}
              style={({ pressed }) => [
                styles.buttonShadow,
                pressed && canRequestOtp && styles.buttonPressed,
                !canRequestOtp && styles.buttonDisabled,
              ]}
            >
              <View style={styles.buttonBorder}>
                <LinearGradient
                  colors={['#0A9BE8', '#2FD3D0', '#4FE4BA']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.button}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
                    style={styles.gloss}
                    pointerEvents="none"
                  />
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonRow}>
                      <Text style={styles.buttonContent}>Get OTP</Text>
                      <Feather name="arrow-right" size={24} color="#FFFFFF" />
                    </View>
                  )}
                </LinearGradient>
              </View>
            </Pressable>

            <Text style={styles.verification}>We’ll send you a verification code.</Text>
        </GlassCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  logo: {
    marginBottom: 26,
  },
  welcome: {
    color: '#100568',
    fontSize: 30,
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
    marginBottom: 10,
  },
  intro: {
    color: '#5778A4',
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  card: { width: '100%' },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    color: '#100568',
    fontSize: 34,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 14,
  },
  label: {
    color: '#254D91',
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 8,
  },
  fieldGap: { marginBottom: 18 },
  phoneField: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  countryCode: {
    color: '#100568',
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
    paddingRight: 14,
  },
  divider: {
    width: 1.5,
    height: 30,
    backgroundColor: 'rgba(87,120,164,0.4)',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingLeft: 14,
    color: '#100568',
    fontSize: 17,
    fontFamily: typography.fontFamily.regular,
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
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
    overflow: 'hidden',
  },
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  buttonDisabled: {
    opacity: 0.58,
  },
  buttonPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    elevation: 3,
  },
  buttonContent: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: typography.fontFamily.semiBold,
  },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
  verification: {
    color: '#5778A4',
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginTop: 14,
  },
});
