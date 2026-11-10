import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import BottomNav from '../../components/BottomNav';
import GlassCard, { glassCardEffects } from '../../components/GlassCard';

const IMAGE_BASED_TESTS = [
  { id: 1, date: '25 Oct 2026' },
  { id: 2, date: '01 Nov 2026' },
  { id: 3, date: '08 Nov 2026' },
  { id: 4, date: '15 Nov 2026' },
];

function ClipboardIcon() {
  return (
    <View style={styles.clipboardIcon}>
      <View style={styles.clipboardClip} />
      <Text style={styles.clipboardCheck}>✓</Text>
    </View>
  );
}

function ScheduleIcon({ name }) {
  if (name === 'calendar') {
    return (
      <View style={styles.calendarIcon}>
        <View style={styles.calendarTop} />
        <View style={styles.calendarDivider} />
      </View>
    );
  }

  if (name === 'clock') {
    return (
      <View style={styles.clockIcon}>
        <View style={styles.clockHandVertical} />
        <View style={styles.clockHandHorizontal} />
      </View>
    );
  }

  if (name === 'award') {
    return (
      <View style={styles.awardIcon}>
        <View style={styles.awardMedal}>
          <Text style={styles.awardStar}>★</Text>
        </View>
        <View style={styles.awardRibbonLeft} />
        <View style={styles.awardRibbonRight} />
      </View>
    );
  }

  return (
    <View style={styles.timerIcon}>
      <View style={styles.timerTop} />
      <View style={styles.timerHand} />
    </View>
  );
}

function BottomNavigation({ onNavigate, onNotificationPress }) {
  return <BottomNav active="tests" onNavigate={onNavigate} onNotificationPress={onNotificationPress} />;
}

function TestScheduleCard({ test, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open IBT ${test.id}, ${test.date}, 9 AM to 2 PM`}
      onPress={() => onPress?.(test)}
      style={styles.testCardPressable}
    >
      {({ pressed }) => (
        <GlassCard
          {...glassCardEffects}
          style={[styles.testCard, pressed && styles.cardPressed]}
          contentStyle={styles.testCardContent}
          radius={24}
        >
          <View style={styles.cardHeader}>
            <View style={styles.testIconTile}>
              <ClipboardIcon />
            </View>
            <Text numberOfLines={1} style={styles.testTitle}>IBT {test.id}</Text>
            <LinearGradient
              colors={['#4C6FE8', '#4FE4BA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.arrowCircle}
            >
              <Text style={styles.arrow}>→</Text>
            </LinearGradient>
          </View>

          <View style={styles.separator} />
          <View style={styles.scheduleRow}>
            <ScheduleIcon name="calendar" />
            <Text style={styles.rowLabel}>Start:</Text>
            <Text numberOfLines={1} style={styles.rowValue}>{test.date} · 9:00 AM</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.scheduleRow}>
            <ScheduleIcon name="clock" />
            <Text style={styles.rowLabel}>End:</Text>
            <Text numberOfLines={1} style={styles.rowValue}>{test.date} · 2:00 PM</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailsRow}>
            <View style={styles.marksDetail}>
              <ScheduleIcon name="award" />
              <Text style={styles.detailText}>300 marks</Text>
            </View>
            <View style={styles.detailsDivider} />
            <View style={styles.durationDetail}>
              <ScheduleIcon name="timer" />
              <Text style={styles.detailText}>Duration: 5 hours</Text>
            </View>
          </View>
        </GlassCard>
      )}
    </Pressable>
  );
}

export default function ImageBasedTestScreen({
  onBack,
  onNavigate,
  onNotificationPress,
  onOpenTest,
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#8CD3E5', '#B0F3E0']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Test Series"
            hitSlop={10}
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.headingGroup}>
            <Text style={styles.heading}>Image Based Test</Text>
            <Text style={styles.subtitle}>Sample schedule · IST</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.testList}>
          {IMAGE_BASED_TESTS.map((test) => (
            <TestScheduleCard key={test.id} test={test} onPress={onOpenTest} />
          ))}
        </View>
      </ScrollView>

      <BottomNavigation onNavigate={onNavigate} onNotificationPress={onNotificationPress} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 20,
  },
  pageHeader: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backArrow: {
    color: '#100568',
    fontSize: 54,
    lineHeight: 58,
    fontFamily: typography.fontFamily.regular,
  },
  headingGroup: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -8,
  },
  heading: {
    color: '#100568',
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    marginTop: 2,
    color: '#5778A4',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  headerSpacer: {
    width: 36,
  },
  testList: {
    gap: 12,
  },
  testCard: {
    flex: 1,
  },
  testCardPressable: {
    width: '100%',
  },
  testCardContent: {
    minHeight: 144,
    padding: 22,
  },
  cardPressed: {
    opacity: 0.88,
  },
  cardHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testIconTile: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(74,213,226,0.18)',
  },
  clipboardIcon: {
    width: 27,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#100568',
    borderRadius: 5,
    marginTop: 4,
  },
  clipboardClip: {
    position: 'absolute',
    top: -6,
    width: 14,
    height: 9,
    borderWidth: 2.5,
    borderColor: '#100568',
    borderRadius: 4,
    backgroundColor: '#B8EEF0',
  },
  clipboardCheck: {
    color: '#100568',
    fontSize: 22,
    lineHeight: 26,
    fontFamily: typography.fontFamily.bold,
  },
  testTitle: {
    flex: 1,
    color: '#100568',
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontFamily: typography.fontFamily.medium,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  scheduleRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIcon: {
    width: 30,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#100568',
    borderRadius: 4,
  },
  calendarTop: {
    position: 'absolute',
    top: -4,
    width: 20,
    height: 5,
    borderTopWidth: 2,
    borderColor: '#100568',
  },
  calendarDivider: {
    position: 'absolute',
    top: 5,
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#100568',
  },
  clockIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#100568',
    borderRadius: 11,
  },
  clockHandVertical: {
    position: 'absolute',
    top: 3,
    width: 2,
    height: 7,
    backgroundColor: '#100568',
  },
  clockHandHorizontal: {
    position: 'absolute',
    top: 9,
    left: 9,
    width: 6,
    height: 2,
    backgroundColor: '#100568',
  },
  awardIcon: {
    width: 30,
    height: 28,
    alignItems: 'center',
  },
  awardMedal: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#100568',
    borderRadius: 10,
  },
  awardStar: {
    color: '#100568',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: typography.fontFamily.bold,
  },
  awardRibbonLeft: {
    position: 'absolute',
    left: 7,
    bottom: 0,
    width: 8,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#100568',
    transform: [{ rotate: '18deg' }],
  },
  awardRibbonRight: {
    position: 'absolute',
    right: 7,
    bottom: 0,
    width: 8,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#100568',
    transform: [{ rotate: '-18deg' }],
  },
  timerIcon: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#100568',
    borderRadius: 11,
  },
  timerTop: {
    position: 'absolute',
    top: -5,
    width: 8,
    height: 4,
    borderWidth: 1.5,
    borderColor: '#100568',
    borderRadius: 2,
    backgroundColor: '#B0F3E0',
  },
  timerHand: {
    position: 'absolute',
    top: 4,
    width: 2,
    height: 7,
    backgroundColor: '#100568',
    transform: [{ rotate: '38deg' }],
  },
  rowLabel: {
    width: 44,
    color: '#5778A4',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  rowValue: {
    flex: 1,
    color: '#100568',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
  },
  detailsRow: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  marksDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: 'rgba(16,5,104,0.3)',
  },
  durationDetail: {
    flex: 1.35,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
  },
  detailText: {
    color: '#100568',
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
  },
  bottomNavContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  bottomNav: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.42)',
    shadowColor: '#009DC5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  navItem: {
    width: 48,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    color: '#12BDBB',
    fontSize: 34,
    lineHeight: 40,
    fontFamily: typography.fontFamily.regular,
  },
  testNavIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#16CDBA',
  },
  testNavQuestion: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 32,
    fontFamily: typography.fontFamily.bold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 34,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#009DC5',
  },
  brandButtonOuter: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: '#C7F7F1',
  },
  brandButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  brandButtonCenter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: '#B0F3E0',
  },
});
