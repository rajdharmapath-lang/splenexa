import { Pressable, StyleSheet, Text, View } from 'react-native';
import typography from '../theme/typography';

export default function PlaceholderScreen({ title, onBack }) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5FBFC',
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
  },
  backText: {
    color: '#100568',
    fontSize: 32,
    lineHeight: 36,
  },
  title: {
    color: '#100568',
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
  },
});
