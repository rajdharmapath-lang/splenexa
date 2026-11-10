import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Loader({ color = '#009DC5', size = 'large' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
