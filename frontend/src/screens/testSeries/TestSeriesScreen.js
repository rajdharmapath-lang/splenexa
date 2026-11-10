import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import GlassCard, { glassCardEffects } from '../../components/GlassCard';
import BottomNav from '../../components/BottomNav';

const NAVY = '#0B0B5C';
const BLUE_TEXT = '#4A5F94';

const TEST_SERIES_TESTS = [
  {
    id: 'grand',
    title: 'Grand Test',
    subtitle: 'Full-length practice to build exam confidence.',
    icon: 'clipboard-check-outline',
  },
  {
    id: 'subject',
    title: 'Subject-wise Test',
    subtitle: 'Strengthen concepts, one subject at a time.',
    icon: 'bookshelf',
  },
  {
    id: 'image',
    title: 'Image Based Test',
    subtitle: 'Sharpen visual recognition with clinical images.',
    icon: 'image-search-outline',
  },
];

const MCQ_SECTIONS = [
  {
    id: 'qbank',
    title: 'Q-Bank',
    subtitle: 'Practice topic-wise MCQs at your own pace.',
    icon: 'help-box-multiple-outline',
  },
  {
    id: 'testSeries',
    title: 'Test Series',
    subtitle: 'Grand, subject-wise, and image-based tests.',
    icon: 'clipboard-list-outline',
  },
];

export default function TestSeriesScreen({
  activeTab = 'testSeries',
  view = 'mcq',
  onBack,
  onNavigate,
  onNotificationPress,
  onOpenTestSeries,
  onOpenGrandTest,
  onOpenSubjectTest,
  onOpenQBank,
  onOpenImageTest,
}) {
  const insets = useSafeAreaInsets();
  const isMcqHome = view === 'mcq';
  const tests = isMcqHome ? MCQ_SECTIONS : TEST_SERIES_TESTS;
  const openTest = isMcqHome
    ? { qbank: onOpenQBank, testSeries: onOpenTestSeries }
    : {
      grand: onOpenGrandTest,
      subject: onOpenSubjectTest,
      image: onOpenImageTest,
    };

  return (
    <LinearGradient
      colors={['#B4E8FC', '#B3F3F5', '#A2F8E0']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 48,
            paddingBottom: insets.bottom + 120,
          },
        ]}
      >
        <View style={styles.heading}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to MCQ"
              onPress={onBack}
              hitSlop={10}
              style={styles.backButton}
            >
              <Feather name="chevron-left" size={30} color={NAVY} />
            </Pressable>
          ) : null}
          <Text style={styles.title}>{isMcqHome ? 'MCQ' : 'Test Series'}</Text>
          {onBack ? <View style={styles.backButtonSpacer} /> : null}
        </View>

        {tests.map((test) => (
          <Pressable
            key={test.id}
            accessibilityRole="button"
            accessibilityLabel={`${test.title}. ${test.subtitle}`}
            onPress={() => openTest[test.id]?.()}
            style={styles.cardGap}
          >
            {({ pressed }) => (
              <GlassCard
                {...glassCardEffects}
                style={pressed && styles.cardPressed}
                contentStyle={styles.row}
              >
                <View style={styles.iconTile}>
                  <MaterialCommunityIcons name={test.icon} size={34} color={NAVY} />
                </View>
                <View style={styles.textWrap}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{test.title}</Text>
                  <Text style={styles.cardSub}>{test.subtitle}</Text>
                </View>
                <LinearGradient
                  colors={['#4C6FE8', '#2FD9B0']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.arrow}
                >
                  <Feather name="arrow-right" size={22} color="#FFFFFF" />
                </LinearGradient>
              </GlassCard>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <BottomNav
        active={activeTab}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    flex: 1,
    color: NAVY,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
    marginBottom: 22,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backButtonSpacer: {
    width: 40,
    height: 44,
  },
  cardGap: {
    marginBottom: 14,
  },
  row: {
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 22,
  },
  iconTile: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: 'rgba(160,215,245,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  cardTitle: {
    color: NAVY,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: typography.fontFamily.bold,
  },
  cardSub: {
    color: BLUE_TEXT,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4,
    fontFamily: typography.fontFamily.regular,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
