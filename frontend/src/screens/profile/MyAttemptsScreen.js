import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';
import BottomNav from '../../components/BottomNav';
import typography from '../../theme/typography';

const STATUS_LABELS = {
  in_progress: 'In progress',
  completed: 'Completed',
  canceled: 'Canceled',
};

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function AttemptCard({ attempt }) {
  const isCompleted = attempt.status === 'completed';
  const hasProgress = Number(attempt.total) > 0;
  const progressText = hasProgress
    ? `${attempt.attempted ?? 0} / ${attempt.total} questions attempted`
    : 'Attempt details unavailable';

  return (
    <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.attemptCard}>
      <View style={styles.attemptHeader}>
        <View style={styles.attemptCopy}>
          <Text style={styles.attemptTitle} numberOfLines={2}>{attempt.title}</Text>
          <Text style={styles.attemptCategory}>{attempt.category}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            isCompleted ? styles.completedBadge : attempt.status === 'canceled' && styles.canceledBadge,
          ]}
        >
          <Text style={styles.statusText}>{STATUS_LABELS[attempt.status]}</Text>
        </View>
      </View>
      <Text style={styles.attemptProgress}>{progressText}</Text>
      {isCompleted && hasProgress && attempt.score !== undefined ? (
        <View style={styles.resultRow}>
          <Text style={styles.resultText}>
            Score: {attempt.score ?? 0} / {attempt.total ?? 0}
          </Text>
          {attempt.accuracy ? <Text style={styles.resultText}>Accuracy: {attempt.accuracy}</Text> : null}
        </View>
      ) : null}
      <Text style={styles.attemptDate}>{formatDate(attempt.updatedAt || attempt.startedAt)}</Text>
    </GlassCard>
  );
}

export default function MyAttemptsScreen({
  attempts,
  loadError,
  onBack,
  onNavigate,
  onNotificationPress,
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={theme.bg}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 120,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Profile"
            hitSlop={10}
            onPress={onBack}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={30} color={theme.navy} />
          </Pressable>
          <Text style={styles.title}>My Attempts</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loadError ? (
          <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.messageCard}>
            <Text style={styles.messageTitle}>Attempt history unavailable</Text>
            <Text style={styles.emptyMessage}>
              The app couldn’t load your saved test activity. Please restart the app and try again.
            </Text>
          </GlassCard>
        ) : attempts.length ? (
          <View style={styles.attemptList}>
            {attempts.map((attempt) => (
              <AttemptCard key={attempt.key} attempt={attempt} />
            ))}
          </View>
        ) : (
          <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.messageCard}>
            <Feather name="clipboard" size={34} color={theme.teal} />
            <Text style={styles.messageTitle}>No test attempts yet</Text>
            <Text style={styles.emptyMessage}>
              Tests you start in Test Series will appear here with their progress and results.
            </Text>
          </GlassCard>
        )}
      </ScrollView>

      <BottomNav
        active="profile"
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    width: 44,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: theme.navy,
    fontSize: 28,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  headerSpacer: {
    width: 44,
  },
  attemptList: {
    gap: 12,
  },
  attemptCard: {
    padding: 18,
  },
  attemptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  attemptCopy: {
    flex: 1,
  },
  attemptTitle: {
    color: theme.navy,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: typography.fontFamily.bold,
  },
  attemptCategory: {
    marginTop: 3,
    color: theme.muted,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(0,157,197,0.16)',
  },
  completedBadge: {
    backgroundColor: 'rgba(23,201,178,0.22)',
  },
  canceledBadge: {
    backgroundColor: 'rgba(214,40,57,0.12)',
  },
  statusText: {
    color: theme.navy,
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
  },
  attemptProgress: {
    marginTop: 14,
    color: theme.navy,
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
  },
  resultRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 7,
  },
  resultText: {
    color: theme.navy,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  attemptDate: {
    marginTop: 10,
    color: theme.muted,
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
  },
  messageCard: {
    alignItems: 'center',
    padding: 24,
  },
  messageTitle: {
    marginTop: 8,
    color: theme.navy,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  emptyMessage: {
    marginTop: 7,
    color: theme.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
});
