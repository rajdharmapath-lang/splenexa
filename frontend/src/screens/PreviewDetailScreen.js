import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../theme/typography';

export default function PreviewDetailScreen({ title, onBack }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#8CD3E5', '#B0F3E0']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>This preview screen is connected. Content can be added here later.</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#100568',
    fontSize: 48,
    lineHeight: 52,
    fontFamily: typography.fontFamily.regular,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    padding: 22,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    color: '#100568',
    fontSize: 28,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  message: {
    marginTop: 12,
    color: '#5778A4',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
});
