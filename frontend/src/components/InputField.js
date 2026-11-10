import { StyleSheet, Text, TextInput, View } from 'react-native';
import typography from '../theme/typography';

export default function InputField({ label, style, ...inputProps }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor="#6E8AB2"
        style={[styles.input, style]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: '#5778A4',
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8EAF0',
    color: '#100568',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
});
