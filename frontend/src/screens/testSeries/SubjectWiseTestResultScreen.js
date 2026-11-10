import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';

function MetricCard({ icon, label, value, width }) {
  return (
    <View style={[styles.metricCard, { width }]}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text numberOfLines={1} style={styles.metricLabel}>{label}</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
        {value}
      </Text>
    </View>
  );
}

export default function SubjectWiseTestResultScreen({
  subjectName = 'Anatomy',
  userName = 'Aswin',
  onBack,
  onReviewQuestions,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width - 48, 760);
  const metricGap = 10;
  const metricWidth = (contentWidth - metricGap * 2) / 3;
  const displayName = userName?.trim() || 'Student';

  return (
    <LinearGradient
      colors={['#B8F0FA', '#A8F9E9']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.screenContent, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.header, { width: contentWidth }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Back to ${subjectName} test`}
            onPress={onBack}
            hitSlop={10}
            style={styles.backButton}
          >
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>
          <View style={styles.headerCopy}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {subjectName} Results
            </Text>
            <Text style={styles.headerSubtitle}>Sample results</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { width: contentWidth, paddingBottom: Math.max(insets.bottom, 18) + 16 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Text style={styles.congratulations}>Well done, Dr. {displayName}!</Text>
            <View style={styles.topicBadge}>
              <Text style={styles.topicLabel}>Topic</Text>
              <Text style={styles.topicValue}>IBT4</Text>
            </View>
            <LinearGradient
              colors={['#00BBD4', '#00DDB5', '#43F0B5']}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.9, y: 0.9 }}
              style={styles.scoreRing}
            >
              <View style={styles.scoreRingInner}>
                <Text style={styles.scoreValue}>240</Text>
                <Text style={styles.scoreTotal}>/ 300</Text>
                <Text style={styles.scoreLabel}>Total score</Text>
              </View>
            </LinearGradient>
          </View>

          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={[styles.metricRow, { gap: metricGap }]}>
            <MetricCard icon="◎" label="Accuracy" value="85.7%" width={metricWidth} />
            <MetricCard icon="▮" label="Percentage" value="80%" width={metricWidth} />
            <MetricCard icon="◴" label="Time Spent" value="04h 18m" width={metricWidth} />
          </View>

          <View style={styles.answerSummary}>
            <View style={styles.answerSummaryLine}>
              <Text style={styles.summaryNumber}>240 <Text style={styles.summaryLabel}>correct</Text></Text>
              <Text style={styles.summaryDot}>·</Text>
              <Text style={styles.summaryNumber}>40 <Text style={styles.summaryLabel}>incorrect</Text></Text>
              <Text style={styles.summaryDot}>·</Text>
              <Text style={styles.summaryNumber}>20 <Text style={styles.summaryLabel}>unanswered</Text></Text>
            </View>
            <Text style={styles.totalQuestions}>(Total 300 questions)</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Review questions"
            onPress={onReviewQuestions}
            style={({ pressed }) => [styles.reviewButtonBorder, pressed && styles.reviewPressed]}
          >
            <LinearGradient
              colors={['#00BBD4', '#00DDB5', '#43F0B5']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.reviewButton}
            >
              <Text style={styles.reviewIcon}>☑</Text>
              <Text style={styles.reviewText}>Review Questions</Text>
              <Text style={styles.reviewArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.82)',
    backgroundColor: 'rgba(255,255,255,0.48)',
    shadowColor: '#00BBD4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  backChevron: {
    color: '#100568',
    fontSize: 38,
    lineHeight: 42,
    fontFamily: typography.fontFamily.regular,
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  headerTitle: {
    color: '#100568',
    fontSize: 21,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    marginTop: 2,
    color: '#5778A4',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    gap: 14,
    paddingTop: 6,
  },
  heroCard: {
    minHeight: 330,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#00BBD4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 3,
  },
  congratulations: {
    marginBottom: 10,
    color: '#100568',
    fontSize: 24,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  topicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 22,
    backgroundColor: 'rgba(0,187,212,0.14)',
  },
  topicLabel: {
    color: '#5778A4',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  topicValue: {
    color: '#100568',
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
  },
  scoreRing: {
    width: 166,
    height: 166,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 83,
  },
  scoreRingInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75,
    backgroundColor: '#C9F7F3',
  },
  scoreValue: {
    color: '#100568',
    fontSize: 40,
    lineHeight: 44,
    fontFamily: typography.fontFamily.bold,
  },
  scoreTotal: {
    color: '#5778A4',
    fontSize: 22,
    fontFamily: typography.fontFamily.medium,
  },
  scoreLabel: {
    marginTop: 4,
    color: '#5778A4',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  sectionTitle: {
    marginTop: 2,
    color: '#100568',
    fontSize: 21,
    fontFamily: typography.fontFamily.bold,
  },
  metricRow: {
    flexDirection: 'row',
  },
  metricCard: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.35)',
    shadowColor: '#00BBD4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  metricIcon: {
    color: '#00BBD4',
    fontSize: 25,
    lineHeight: 30,
    fontFamily: typography.fontFamily.bold,
  },
  metricLabel: {
    marginTop: 3,
    color: '#5778A4',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  metricValue: {
    marginTop: 2,
    color: '#100568',
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
  },
  answerSummary: {
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  answerSummaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    columnGap: 7,
  },
  summaryNumber: {
    color: '#100568',
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
  summaryLabel: {
    color: '#5778A4',
    fontFamily: typography.fontFamily.medium,
  },
  summaryDot: {
    color: '#5778A4',
    fontSize: 17,
  },
  totalQuestions: {
    marginTop: 3,
    color: '#5778A4',
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  reviewButtonBorder: {
    minHeight: 70,
    overflow: 'hidden',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#00BBD4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
  },
  reviewPressed: {
    opacity: 0.86,
  },
  reviewButton: {
    flex: 1,
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  reviewIcon: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  reviewText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
  reviewArrow: {
    color: '#FFFFFF',
    fontSize: 28,
  },
});
