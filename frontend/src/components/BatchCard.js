import { Pressable, StyleSheet, Text } from 'react-native';
import typography from '../theme/typography';

export default function BatchCard({ title, description, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 22,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    color: '#100568',
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
  description: {
    marginTop: 6,
    color: '#5778A4',
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
  },
});
