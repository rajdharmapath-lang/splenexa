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
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';
import typography from '../../theme/typography';

const PASS_MARK = 75;

const SAMPLE_RESULT = {
  testTitle: 'Grand Test 4',
  subtitle: 'Sample results',
  userName: 'Dr. Aswin',
  score: 240,
  total: 300,
  rank: 12,
  accuracy: '85.7%',
  percentage: '80%',
  timeSpent: '04h 18m',
  correct: 240,
  incorrect: 40,
  unanswered: 20,
  subjects: [
    { name: 'Anatomy', percent: 82.5 },
    { name: 'Physiology', percent: 87.5 },
    { name: 'Pharmacology', percent: 70 },
    { name: 'Biochemistry', percent: 87.5 },
  ],
  leaderboard: [
    { name: 'Dr. Asha', score: 294, total: 300, percent: 98 },
    { name: 'Dr. Rahul', score: 291, total: 300, percent: 97 },
    { name: 'Dr. Meera', score: 288, total: 300, percent: 96 },
    { name: 'Dr. Arjun', score: 285, total: 300, percent: 95 },
    { name: 'Dr. Priya', score: 282, total: 300, percent: 94 },
    { name: 'Dr. Kiran', score: 279, total: 300, percent: 93 },
    { name: 'Dr. Neha', score: 276, total: 300, percent: 92 },
    { name: 'Dr. Vikram', score: 273, total: 300, percent: 91 },
    { name: 'Dr. Sana', score: 270, total: 300, percent: 90 },
    { name: 'Dr. Rohan', score: 267, total: 300, percent: 89 },
  ],
};

function ScoreRing({ score, total, size = 156, stroke = 13 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / Math.max(total, 1)));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="grandTestScoreRing" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#00B8E6" />
            <Stop offset="1" stopColor="#2FF2C0" />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(150,205,230,0.45)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#grandTestScoreRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference * progress} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.ringCenter}>
          <Text style={styles.ringScore}>{score}</Text>
          <Text style={styles.ringTotal}>/ {total}</Text>
          <Text style={styles.ringLabel}>Total score</Text>
        </View>
      </View>
    </View>
  );
}

function Metric({ icon, label, value, valueSize, labelSize }) {
  return (
    <GlassCard
      {...glassCardEffects}
      radius={22}
      style={{ flex: 1 }}
      contentStyle={styles.metric}
    >
      <View style={styles.metricIcon}>{icon}</View>
      <View style={styles.metricText}>
        <Text style={[styles.metricLabel, { fontSize: labelSize }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.metricValue, { fontSize: valueSize }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </GlassCard>
  );
}

function SubjectRow({ name, percent }) {
  const isBelowTarget = percent < PASS_MARK;
  const clampedPercent = Math.max(0, Math.min(100, percent));

  return (
    <View style={styles.subjectRow}>
      <Text style={styles.subjectName} numberOfLines={1}>{name}</Text>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`${name} performance`}
        accessibilityValue={{ min: 0, max: 100, now: clampedPercent }}
        style={styles.barTrack}
      >
        <LinearGradient
          colors={isBelowTarget ? ['#FFAA14', '#FFD86A'] : ['#00B2D8', '#3FE8C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${clampedPercent}%` }]}
        />
      </View>
      <Text style={[styles.subjectPct, { color: isBelowTarget ? '#F2A100' : '#0F9AA8' }]}>
        {percent}%
      </Text>
    </View>
  );
}

const MEDALS = {
  1: { color: '#F5B800', row: 'rgba(255,214,120,0.28)' },
  2: { color: '#A9B8D0', row: 'rgba(200,215,240,0.38)' },
  3: { color: '#C9835A', row: 'rgba(235,170,140,0.30)' },
};

function RankBadge({ rank }) {
  const medal = MEDALS[rank];

  if (medal) {
    return (
      <View style={styles.medalWrap}>
        <Ionicons name="ribbon" size={40} color={medal.color} />
        <Text style={styles.medalNum}>{rank}</Text>
      </View>
    );
  }

  return (
    <View style={styles.rankCircle}>
      <Text style={styles.rankNum}>{rank}</Text>
    </View>
  );
}

function LeaderRow({ rank, item }) {
  const isTopThree = rank <= 3;

  return (
    <View
      style={[
        styles.leaderRow,
        { backgroundColor: isTopThree ? MEDALS[rank].row : 'rgba(255,255,255,0.38)' },
      ]}
    >
      <RankBadge rank={rank} />
      <Text style={styles.leaderName} numberOfLines={1}>{item.name}</Text>
      <Text style={[styles.leaderScore, isTopThree && styles.topLeaderScore]}>
        {item.score} / {item.total}
      </Text>
      <View style={styles.pctPill}>
        <Text style={styles.pctText}>{item.percent}%</Text>
      </View>
    </View>
  );
}

export default function GrandTestResultScreen({
  result: resultData = SAMPLE_RESULT,
  testTitle,
  userName,
  variant = 'grandTest',
  topicName,
  onBack,
  onReviewQuestions,
  onReview,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const displayName = (userName ?? resultData.userName ?? 'Student').trim() || 'Student';
  const result = {
    ...SAMPLE_RESULT,
    ...resultData,
    testTitle: testTitle ?? resultData.testTitle ?? SAMPLE_RESULT.testTitle,
    userName: displayName.startsWith('Dr.') ? displayName : `Dr. ${displayName}`,
  };
  const isSubjectWise = variant === 'subjectWise';
  const displayTopic = topicName ?? result.testTitle;
  const metricTextWidth = Math.max(1, (width - 60) / 3 - 42);
  const maxMetricValueLength = Math.max(
    String(result.accuracy ?? '').length,
    String(result.percentage ?? '').length,
    String(result.timeSpent ?? '').length,
    1,
  );
  const maxMetricLabelLength = Math.max('Accuracy'.length, 'Percentage'.length, 'Time Spent'.length);
  const valueSize = Math.max(10, Math.min(19, metricTextWidth / (maxMetricValueLength * 0.62)));
  const labelSize = Math.max(9, Math.min(12.5, metricTextWidth / (maxMetricLabelLength * 0.56)));

  return (
    <LinearGradient
      colors={['#B7E8FB', '#B3F2F8', '#A9F8E6']}
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
            paddingTop: insets.top + 14,
            paddingBottom: insets.bottom + 32,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerBack}>
            <Pressable
              onPress={onBack}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <GlassCard
                {...glassCardEffects}
                radius={16}
                contentStyle={styles.backButton}
              >
                <Feather name="chevron-left" size={26} color={theme.navy} />
              </GlassCard>
            </Pressable>
          </View>
          <View pointerEvents="none" style={styles.headerCopy}>
            <Text
              style={styles.headerTitle}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {isSubjectWise ? `${displayTopic} Results` : `${result.testTitle} Results`}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {result.subtitle}
            </Text>
          </View>
        </View>

        <GlassCard
          {...glassCardEffects}
          radius={30}
          style={styles.heroWrap}
          contentStyle={styles.hero}
        >
          <Text style={styles.wellDone}>Well done, {result.userName}!</Text>
          {variant !== 'grandTest' ? (
            <View style={styles.topicPill}>
              <Text style={styles.topicLabel}>Topic</Text>
              <Text style={styles.topicValue} numberOfLines={1}>
                {displayTopic}
              </Text>
            </View>
          ) : null}
          <View style={styles.scoreRingWrap}>
            <ScoreRing score={result.score} total={result.total} />
          </View>
          {!isSubjectWise && result.rank != null ? (
            <View style={styles.rankGlow}>
              <LinearGradient
                colors={['#0A8FE0', '#3FE8B8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.rankPill}
              >
                <Ionicons name="trophy" size={20} color="#FFFFFF" />
                <Text style={styles.rankText}>Global Rank # {result.rank}</Text>
              </LinearGradient>
            </View>
          ) : null}
        </GlassCard>

        <Text style={styles.section}>Performance Metrics</Text>
        <View style={styles.metricsRow}>
          <Metric
            icon={<MaterialCommunityIcons name="bullseye-arrow" size={26} color="#12A9C9" />}
            label="Accuracy"
            value={result.accuracy}
            valueSize={valueSize}
            labelSize={labelSize}
          />
          <Metric
            icon={<Ionicons name="stats-chart" size={24} color="#15BFA8" />}
            label="Percentage"
            value={result.percentage}
            valueSize={valueSize}
            labelSize={labelSize}
          />
          <Metric
            icon={<Ionicons name="stopwatch-outline" size={26} color="#12A9C9" />}
            label="Time Spent"
            value={result.timeSpent}
            valueSize={valueSize}
            labelSize={labelSize}
          />
        </View>

        {!isSubjectWise || result.isEvaluated ? (
          <GlassCard
            {...glassCardEffects}
            radius={24}
            style={styles.summaryWrap}
            contentStyle={styles.summary}
          >
            <Text style={styles.summaryTitle}>Question Summary</Text>
            <View style={styles.summaryCounts}>
              <View style={styles.summaryItem}>
                <Text style={styles.sumNum}>{result.correct}</Text>
                <Text style={styles.sumWord}>Correct</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.sumNum}>{result.incorrect}</Text>
                <Text style={styles.sumWord}>Incorrect</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.sumNum}>{result.unanswered}</Text>
                <Text style={styles.sumWord} numberOfLines={1}>Unanswered</Text>
              </View>
            </View>
            <Text style={styles.summarySub}>Total {result.total} questions</Text>
          </GlassCard>
        ) : null}

        {!isSubjectWise && !result.isEvaluated ? (
          <>
            <Text style={styles.section}>Subject Performance</Text>
            <GlassCard
              {...glassCardEffects}
              radius={26}
              contentStyle={styles.subjectsCard}
            >
              {result.subjects.map((subject) => (
                <SubjectRow key={subject.name} name={subject.name} percent={subject.percent} />
              ))}
            </GlassCard>
          </>
        ) : null}

        {!result.isEvaluated ? (
          <Pressable
            onPress={onReviewQuestions ?? onReview}
            style={styles.reviewPressable}
            accessibilityRole="button"
            accessibilityLabel="Review Questions"
          >
            <LinearGradient
              colors={['#0A8FE0', '#3FE8B8']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.reviewButton}
            >
              <MaterialCommunityIcons name="clipboard-check-outline" size={30} color="#FFFFFF" />
              <Text style={styles.reviewText}>Review Questions</Text>
              <Feather name="arrow-right" size={26} color="#FFFFFF" />
            </LinearGradient>
          </Pressable>
        ) : null}

        {!isSubjectWise && !result.isEvaluated ? (
          <>
            <Text style={[styles.section, styles.leaderboardHeading]}>Top 10 Ranks</Text>
            <Text style={styles.sectionSubtitle}>Sample leaderboard</Text>
            <GlassCard
              {...glassCardEffects}
              radius={28}
              style={styles.leaderboardWrap}
              contentStyle={styles.leaderboardCard}
            >
              {result.leaderboard.map((item, index) => (
                <LeaderRow key={`${item.name}-${index}`} rank={index + 1} item={item} />
              ))}
            </GlassCard>
          </>
        ) : null}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
  },
  header: {
    height: 52,
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerBack: {
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 48,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: theme.navy,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: theme.muted,
    marginTop: 1,
  },
  heroWrap: {
    marginTop: 0,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  wellDone: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 24,
    color: theme.navy,
    textAlign: 'center',
  },
  topicPill: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  topicLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: theme.muted,
  },
  topicValue: {
    flexShrink: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: theme.navy,
  },
  scoreRingWrap: {
    marginTop: 12,
  },
  ringCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringScore: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 44,
    lineHeight: 50,
    color: theme.navy,
  },
  ringTotal: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 20,
    color: '#7F93B5',
    marginTop: -2,
  },
  ringLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: '#7F93B5',
    marginTop: 4,
  },
  rankGlow: {
    marginTop: 14,
    borderRadius: 24,
    shadowColor: '#10C8D8',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 26,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  rankText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: '#FFFFFF',
  },
  section: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 22,
    color: theme.navy,
    marginTop: 22,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metric: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  metricIcon: {
    width: 26,
    alignItems: 'center',
  },
  metricText: {
    flex: 1,
    minWidth: 0,
    marginLeft: 4,
  },
  metricLabel: {
    fontFamily: typography.fontFamily.semiBold,
    color: theme.muted,
  },
  metricValue: {
    fontFamily: typography.fontFamily.bold,
    color: theme.navy,
    marginTop: 1,
  },
  summaryWrap: {
    marginTop: 12,
  },
  summary: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  summaryTitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: theme.muted,
    marginBottom: 8,
  },
  summaryCounts: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  sumNum: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: theme.navy,
  },
  sumWord: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: '#4F7DB8',
  },
  summarySub: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: theme.muted,
    marginTop: 8,
  },
  subjectsCard: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subjectName: {
    width: 106,
    fontFamily: typography.fontFamily.bold,
    fontSize: 15,
    color: theme.navy,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'rgba(150,205,230,0.35)',
    marginHorizontal: 8,
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  subjectPct: {
    width: 52,
    textAlign: 'right',
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
  },
  reviewPressable: {
    marginTop: 18,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#00BBD4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  reviewButton: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  reviewText: {
    flex: 1,
    fontFamily: typography.fontFamily.bold,
    fontSize: 20,
    color: '#FFFFFF',
  },
  leaderboardHeading: {
    marginTop: 22,
    marginBottom: 0,
  },
  sectionSubtitle: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 14,
    color: theme.muted,
    marginTop: 1,
  },
  leaderboardWrap: {
    marginTop: 10,
  },
  leaderboardCard: {
    padding: 10,
  },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderRadius: 22,
    paddingHorizontal: 10,
    marginVertical: 3,
  },
  medalWrap: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalNum: {
    position: 'absolute',
    top: 7,
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  rankCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 1,
    backgroundColor: 'rgba(160,210,245,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNum: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: theme.navy,
  },
  leaderName: {
    flex: 1,
    marginLeft: 14,
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 16,
    color: theme.navy,
  },
  leaderScore: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: theme.navy,
    marginRight: 10,
  },
  topLeaderScore: {
    fontFamily: typography.fontFamily.bold,
  },
  pctPill: {
    minWidth: 58,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(79,228,186,0.32)',
    alignItems: 'center',
  },
  pctText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: '#0F9A84',
  },
});
