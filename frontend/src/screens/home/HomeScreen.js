import {
  Animated,
  Easing,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';
import BottomNav from '../../components/BottomNav';

function SectionTitle({ type, title, streakCompleted = false }) {
  const flameMotion = useRef(new Animated.Value(0)).current;
  const coreMotion = useRef(new Animated.Value(0)).current;
  const smokeMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type !== 'streak') {
      return undefined;
    }

    if (!streakCompleted) {
      const smokeAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(smokeMotion, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(smokeMotion, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(180),
        ]),
      );
      smokeAnimation.start();
      return () => smokeAnimation.stop();
    }

    const flameAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flameMotion, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(flameMotion, {
          toValue: 0,
          duration: 430,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const coreAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(180),
        Animated.timing(coreMotion, {
          toValue: 1,
          duration: 390,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(coreMotion, {
          toValue: 0,
          duration: 460,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    flameAnimation.start();
    coreAnimation.start();
    return () => {
      flameAnimation.stop();
      coreAnimation.stop();
    };
  }, [coreMotion, flameMotion, smokeMotion, streakCompleted, type]);

  const flameTransform = {
    transform: [
      {
        translateY: flameMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [1, -2],
        }),
      },
      {
        scaleY: flameMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [0.94, 1.16],
        }),
      },
      {
        rotate: flameMotion.interpolate({
          inputRange: [0, 1],
          outputRange: ['-4deg', '4deg'],
        }),
      },
    ],
  };
  const smokeStyle = {
    opacity: smokeMotion.interpolate({
      inputRange: [0, 0.18, 1],
      outputRange: [0, 0.55, 0],
    }),
    transform: [
      {
        translateY: smokeMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [4, -11],
        }),
      },
      {
        translateX: smokeMotion.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -2, 2],
        }),
      },
      {
        scale: smokeMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.1],
        }),
      },
    ],
  };
  const coreTransform = {
    transform: [
      {
        translateY: coreMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [1, -4],
        }),
      },
      {
        scaleY: coreMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [0.85, 1.2],
        }),
      },
      {
        rotate: coreMotion.interpolate({
          inputRange: [0, 1],
          outputRange: ['3deg', '-5deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.sectionHeading}>
      <View style={type === 'streak' ? styles.streakIcon : styles.questionIcon}>
        {type === 'streak' ? streakCompleted ? (
          <View style={styles.fireArtwork}>
            <Svg width={30} height={30} viewBox="0 0 34 34">
              <Path
                d="M19.2 1.5c1.1 5.2 6.7 8.3 8.5 14.1 2.4 7.7-2 15.2-10.6 16-7.5.7-13.2-4.3-12.6-11.4.4-4.8 3.2-8.2 7.2-12.1.1 3.7 1.4 5.9 3.5 7.1.3-4.7 2-9.4 4-13.7z"
                fill="#F4511E"
              />
              <Path
                d="M18.5 15.2c.7 2.1 3.9 4.6 3.5 8.2-.3 2.9-2.2 4.8-5.1 4.8-3.1 0-5.1-2.1-4.7-4.9.3-2.2 2-3.7 3.1-5.8.4 1.7 1 2.7 1.9 3.2.1-1.9.6-3.7 1.3-5.5z"
                fill="#FFB300"
              />
            </Svg>
            <Animated.View pointerEvents="none" style={[styles.fireTongue, flameTransform]}>
              <Svg width={18} height={22} viewBox="0 0 18 22">
                <Path
                  d="M10 1c.7 3.3 5.1 5.1 5.2 10.1.1 4.9-2.6 8.2-6.7 8.2-4.3 0-7-3-6.3-7.2.4-2.5 2.2-4.2 4-6.4.2 2.2 1 3.5 2.1 4.2C8.5 6.6 9.2 3.7 10 1z"
                  fill="#FF7A1A"
                />
              </Svg>
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.fireCore, coreTransform]}>
              <Svg width={12} height={16} viewBox="0 0 12 16">
                <Path
                  d="M7 1c.4 2.5 3.7 4.4 3.5 8.1-.1 3.2-1.8 5.2-4.5 5.2-3 0-4.9-2.2-4.4-5.1.3-1.8 1.5-3 2.7-4.4.1 1.5.7 2.4 1.4 2.8C5.8 5.2 6.3 3.1 7 1z"
                  fill="#FFF176"
                />
              </Svg>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.fireArtwork}>
            <Animated.View pointerEvents="none" style={[styles.smoke, smokeStyle]}>
              <Svg width={22} height={20} viewBox="0 0 22 20">
                <Path
                  d="M7 18c-2-2-1-4 1-5s3-2 2-4m3 9c-1-2 0-4 2-5s2-3 1-5m1 10c-1-2 0-3 2-4"
                  fill="none"
                  stroke="#8C7772"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
            <Svg width={25} height={25} viewBox="0 0 34 34">
              <Path
                d="M19.2 5c1.1 4.2 5.2 7.3 6.2 11.6 1.6 6.7-2 12.2-8.6 12.8-6.1.5-10.5-3.5-10.1-9.2.3-3.8 2.5-6.6 5.8-9.9.2 3 1.2 4.9 2.8 5.8.4-3.8 2-7.5 3.9-11.1z"
                fill="#705C57"
              />
              <Path
                d="M19.6 20.1c.7 1.5 2.3 2.8 2 4.7-.2 1.9-1.6 3.1-3.7 3.1-2.2 0-3.6-1.3-3.4-3.1.1-1.4 1.2-2.5 2.3-3.8.2 1 .6 1.6 1.1 2 .3-1.1.9-2 1.7-2.9z"
                fill="#F15B32"
              />
              <Path
                d="M18.5 24.2c.4.8 1.2 1.4 1.1 2.3-.1.9-.8 1.5-1.7 1.5-1 0-1.7-.7-1.6-1.5.1-.6.6-1.1 1-1.7.1.5.3.8.6 1 .1-.6.3-1.1.6-1.6z"
                fill="#FFC247"
              />
            </Svg>
          </View>
        ) : (
          <Ionicons name="help" size={18} color="#FFFFFF" />
        )}
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function HomeScreen({
  userName = 'Aswin',
  streakDays = [],
  streakCount = 0,
  streakCompleted = false,
  streakError,
  todayQuestion = 'Which of the following inhalation agents has a blood-gas partition coefficient similar to nitrous oxide?',
  todayQuestionSubject = '',
  previousVideoTitle = 'Previous Video',
  videoProgress = 0.55,
  thumbnail = require('../../assets/images/home-video-thumbnail.png'),
  activeTab = 'home',
  onAnswerQuestion,
  onOpenPreviousVideo,
  onOpenPdf,
  onOpenImageBank,
  onNavigate,
  onNotificationPress,
}) {
  const insets = useSafeAreaInsets();
  const clampedProgress = Math.max(0, Math.min(videoProgress, 1));
  const displayName = userName.trim() || 'Aswin';

  return (
    <LinearGradient
      colors={theme.bg}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <StatusBar hidden />
      <ScrollView
        style={styles.scrollView}
        contentOffset={{ x: 0, y: 0 }}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 48,
            paddingBottom: insets.bottom + 130,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Hi, {displayName}</Text>
          <Text style={styles.greetingSubtitle}>Let’s continue your FMGE learning.</Text>
        </View>

        <GlassCard
          {...glassCardEffects}
          style={styles.streakCard}
          contentStyle={styles.streakCardContent}
        >
          <View style={styles.streakTitleRow}>
            <SectionTitle
              type="streak"
              title="7-day streak"
              streakCompleted={streakCompleted}
            />
            <Text style={styles.streakCount}>{Math.min(streakCount, 7)}/7</Text>
          </View>
          <View style={styles.streakDays}>
            {streakDays.slice(0, 7).map((day, index) => (
              <View key={`${day.label}-${index}`} style={styles.streakDay}>
                {day.completed ? (
                  <LinearGradient
                    colors={theme.accent}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.completedCircle}
                  >
                    <Feather name="check" size={16} color="#FFFFFF" />
                  </LinearGradient>
                ) : (
                  <View style={styles.streakCircle} />
                )}
                <Text style={[styles.dayLabel, day.completed && styles.completedDayLabel]}>{day.label}</Text>
              </View>
            ))}
          </View>
          {streakError ? (
            <Text style={styles.streakError}>
              Your streak could not be loaded. Please restart the app and try again.
            </Text>
          ) : null}
        </GlassCard>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Answer today's ${todayQuestionSubject} question`}
          onPress={onAnswerQuestion}
          style={({ pressed }) => [styles.questionPressable, pressed && styles.cardPressed]}
        >
          <GlassCard {...glassCardEffects} contentStyle={styles.questionCardContent}>
            <SectionTitle type="question" title="Today's Question" />
            <Text style={styles.questionText}>{todayQuestion}</Text>
            <View style={styles.questionFooter}>
              <Text style={styles.questionSubject}>{todayQuestionSubject}</Text>
              <LinearGradient
                colors={['#4C6FE8', theme.mint]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.questionArrow}
              >
                <Feather name="arrow-right" size={22} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </GlassCard>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${previousVideoTitle}`}
          onPress={onOpenPreviousVideo}
          style={({ pressed }) => [styles.videoPressable, pressed && styles.cardPressed]}
        >
          <GlassCard {...glassCardEffects} contentStyle={styles.videoCardContent}>
            <View style={styles.thumbnailWrap}>
              <Image
                source={thumbnail}
                resizeMode="cover"
                style={styles.videoThumbnail}
                accessibilityLabel="Anatomy lesson video thumbnail"
              />
              <View style={styles.playButton}>
                <Ionicons name="play" size={20} color={theme.navy} />
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text numberOfLines={2} style={styles.videoTitle}>
                {previousVideoTitle}
              </Text>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={theme.accent}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.progressFill, { width: `${clampedProgress * 100}%` }]}
                />
              </View>
            </View>
          </GlassCard>
        </Pressable>

        <View style={styles.resourceRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open PDF resources"
            onPress={onOpenPdf}
            style={styles.resourcePressable}
          >
            <GlassCard
              {...glassCardEffects}
              style={styles.resourceCard}
              contentStyle={styles.resourceCardContent}
            >
              <View style={styles.resourceIcon}>
                <Ionicons name="document-text-outline" size={42} color={theme.navy} />
              </View>
              <View style={styles.resourceFooter}>
                <Text style={styles.resourceTitle}>PDF</Text>
                <Feather name="chevron-right" size={20} color={theme.muted} />
              </View>
            </GlassCard>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open image bank"
            onPress={onOpenImageBank}
            style={styles.resourcePressable}
          >
            <GlassCard
              {...glassCardEffects}
              style={styles.resourceCard}
              contentStyle={styles.resourceCardContent}
            >
              <View style={styles.resourceIcon}>
                <Ionicons name="image-outline" size={42} color={theme.navy} />
              </View>
              <View style={styles.resourceFooter}>
                <Text numberOfLines={1} style={styles.resourceTitle}>
                  Image Bank
                </Text>
                <Feather name="chevron-right" size={20} color={theme.muted} />
              </View>
            </GlassCard>
          </Pressable>
        </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  greeting: {
    marginBottom: 0,
  },
  greetingTitle: {
    color: theme.navy,
    fontSize: 34,
    fontFamily: typography.fontFamily.bold,
    lineHeight: 41,
  },
  greetingSubtitle: {
    color: theme.muted,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: typography.fontFamily.regular,
  },
  streakCard: {
    marginTop: 20,
  },
  streakCardContent: {
    padding: 18,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  streakIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#FFD9B8',
  },
  fireArtwork: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireTongue: {
    position: 'absolute',
    top: 4,
    left: 8,
  },
  fireCore: {
    position: 'absolute',
    top: 13,
    left: 11,
  },
  smoke: {
    position: 'absolute',
    top: -5,
    left: 4,
  },
  questionIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: theme.blue,
  },
  sectionTitle: {
    color: theme.navy,
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    marginLeft: 10,
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakCount: {
    color: theme.teal,
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
  },
  streakError: {
    marginTop: 10,
    color: '#A33B48',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: typography.fontFamily.medium,
  },
  streakDay: {
    alignItems: 'center',
  },
  streakCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  completedCircle: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  dayLabel: {
    marginTop: 6,
    color: theme.muted,
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
  },
  completedDayLabel: {
    color: theme.muted,
  },
  questionPressable: {
    marginTop: 14,
  },
  cardPressed: {
    opacity: 0.88,
  },
  questionCardContent: {
    padding: 18,
  },
  questionText: {
    color: theme.navy,
    fontSize: 18,
    lineHeight: 27,
    fontFamily: typography.fontFamily.regular,
    marginTop: 14,
    paddingRight: 0,
  },
  questionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  questionSubject: {
    flex: 1,
    marginRight: 12,
    color: theme.teal,
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
  },
  questionArrow: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 23,
  },
  videoPressable: {
    marginTop: 14,
  },
  videoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  videoThumbnail: {
    width: 118,
    height: 86,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#CFE6F3',
  },
  thumbnailWrap: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: 23,
    left: 39,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 16,
  },
  videoTitle: {
    color: theme.navy,
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'rgba(120,190,220,0.35)',
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  resourceRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
  },
  resourcePressable: {
    flex: 1,
  },
  resourceCard: {
    flex: 1,
  },
  resourceCardContent: {
    height: 132,
    justifyContent: 'space-between',
    padding: 22,
  },
  resourceIcon: {
    width: 64,
    height: 64,
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(170,220,245,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  resourceTitle: {
    flexShrink: 1,
    color: theme.navy,
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
});
