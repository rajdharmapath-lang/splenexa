import { StyleSheet, TextInput, View } from 'react-native';
import Button from './Button';
import typography from '../theme/typography';

export default function CouponInput({ value, onChangeText, onApply, disabled = false }) {
  return (
    <View style={styles.row}>
      <TextInput
        accessibilityLabel="Coupon code"
        autoCapitalize="characters"
        onChangeText={onChangeText}
        placeholder="Enter coupon code"
        placeholderTextColor="#6E8AB2"
        style={styles.input}
        value={value}
      />
      <Button disabled={disabled} onPress={onApply} title="Apply" />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8EAF0',
    color: '#100568',
    backgroundColor: '#FFFFFF',
    fontFamily: typography.fontFamily.regular,
  },
});
