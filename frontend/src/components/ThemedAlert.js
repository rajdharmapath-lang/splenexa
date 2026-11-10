import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from './GlassCard';
import typography from '../theme/typography';

export default function ThemedAlert({
  visible,
  title,
  message,
  actions = [],
  onRequestClose,
  contentPadding = 16,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.backdrop,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
      >
        <GlassCard
          {...glassCardEffects}
          radius={28}
          style={styles.dialog}
          contentStyle={[styles.dialogContent, { padding: contentPadding }]}
          fillOpacity={0.3}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            {actions.map((action) => (
              <Pressable
                key={action.label}
                accessibilityRole="button"
                onPress={action.onPress}
                style={({ pressed }) => [
                  styles.actionPressable,
                  action.variant === 'secondary' && styles.secondaryPressable,
                  pressed && styles.actionPressed,
                ]}
              >
                {action.variant === 'secondary' ? (
                  <Text style={styles.secondaryText}>{action.label}</Text>
                ) : (
                  <LinearGradient
                    colors={
                      action.variant === 'destructive'
                        ? ['#D62839', '#F06A67']
                        : ['#4C6FE8', '#2FD9D0']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.primaryButton}
                  >
                    <Text style={styles.primaryText}>{action.label}</Text>
                  </LinearGradient>
                )}
              </Pressable>
            ))}
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(10,18,70,0.48)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  dialogContent: {
    padding: 16,
  },
  title: {
    color: theme.navy,
    fontSize: 21,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  message: {
    marginTop: 10,
    color: '#25316F',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionPressable: {
    flex: 1,
    minHeight: 48,
    overflow: 'hidden',
    alignItems: 'stretch',
    justifyContent: 'center',
    borderRadius: 25,
  },
  primaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 24,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  secondaryPressable: {
    borderWidth: 1,
    borderColor: 'rgba(16,22,107,0.3)',
    backgroundColor: 'rgba(255,255,255,0.62)',
  },
  secondaryText: {
    color: theme.navy,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  actionPressed: {
    opacity: 0.82,
  },
});
