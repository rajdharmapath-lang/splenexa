import { Pressable, StyleSheet, Text } from 'react-native';
import typography from '../theme/typography';

export default function Button({ title, onPress, disabled = false, style }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#009DC5',
  },
  disabled: {
    opacity: 0.55,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
});
