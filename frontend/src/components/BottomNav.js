import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from './GlassCard';

const ICON_SIZE = 40;
const CENTER_ICON_SIZE = 68;

function GradientIcon({ name, size = ICON_SIZE }) {
  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <View style={styles.iconMask}>
          <Ionicons name={name} size={size} color="#000000" />
        </View>
      }
    >
      <LinearGradient colors={theme.accent} style={{ width: size, height: size }} />
    </MaskedView>
  );
}

function MCQIcon({ active }) {
  const Circle = active ? LinearGradient : View;

  return (
    <Circle
      {...(active ? { colors: theme.accent, start: { x: 0, y: 0 }, end: { x: 1, y: 1 } } : {})}
      style={[styles.mcqCircle, active ? styles.mcqCircleActive : styles.mcqCircleInactive]}
    >
      <Text style={[styles.mcqLabel, !active && styles.mcqLabelInactive]}>MCQ</Text>
    </Circle>
  );
}

function Underline({ style }) {
  return (
    <LinearGradient
      colors={theme.accent}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.underline, style]}
    />
  );
}

export default function BottomNav({
  active = 'home',
  onNavigate,
  onNotificationPress,
  onTabPress,
}) {
  const insets = useSafeAreaInsets();
  const activeTests = active === 'tests' || active === 'testSeries';
  const navigate = (tab) => {
    if (onTabPress) {
      onTabPress(tab === 'testSeries' ? 'tests' : tab);
      return;
    }

    onNavigate?.(tab);
  };
  const pressCenter = () => {
    if (onTabPress) {
      onTabPress('center');
      return;
    }

    onNavigate?.('notifications');
    onNotificationPress?.();
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + 12 }]}
    >
      <GlassCard
        {...glassCardEffects}
        radius={30}
        style={styles.card}
        contentStyle={styles.row}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: active === 'home' }}
          accessibilityLabel="Home"
          onPress={() => navigate('home')}
          style={styles.item}
        >
          {active === 'home' ? (
            <GradientIcon name="home" />
          ) : (
            <Ionicons name="home-outline" size={ICON_SIZE} color={theme.teal} />
          )}
          {active === 'home' ? <Underline /> : null}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: active === 'videos' }}
          accessibilityLabel="Videos"
          onPress={() => navigate('videos')}
          style={styles.item}
        >
          {active === 'videos' ? (
            <GradientIcon name="play-circle" />
          ) : (
            <Ionicons name="play-circle-outline" size={ICON_SIZE} color={theme.teal} />
          )}
          {active === 'videos' ? <Underline /> : null}
        </Pressable>

        <View style={styles.centerSpace} />

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: activeTests }}
          accessibilityLabel={activeTests ? 'Test Series, selected' : 'Test Series'}
          onPress={() => navigate('testSeries')}
          style={styles.item}
        >
          <MCQIcon active={activeTests} />
          {activeTests ? <Underline /> : null}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: active === 'profile' }}
          accessibilityLabel="Profile"
          onPress={() => navigate('profile')}
          style={styles.item}
        >
          {active === 'profile' ? (
            <GradientIcon name="person" />
          ) : (
            <Ionicons name="person-outline" size={ICON_SIZE} color={theme.teal} />
          )}
          {active === 'profile' ? <Underline /> : null}
        </Pressable>
      </GlassCard>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications"
        onPress={pressCenter}
        style={styles.orbOuter}
      >
        <Image
          source={require('../assets/images/ai-button.png')}
          resizeMode="contain"
          style={styles.orbImage}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  iconMask: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mcqCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ICON_SIZE / 2,
  },
  mcqCircleActive: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  mcqCircleInactive: {
    borderWidth: 2,
    borderColor: theme.teal,
  },
  mcqLabel: {
    color: theme.navy,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  mcqLabelInactive: {
    color: theme.teal,
  },
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    alignItems: 'center',
  },
  card: {
    width: '100%',
  },
  row: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  item: {
    position: 'relative',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  underline: {
    position: 'absolute',
    bottom: -3,
    width: 32,
    height: 4,
    borderRadius: 2,
  },
  centerSpace: {
    width: 84,
  },
  orbOuter: {
    position: 'absolute',
    top: -14,
    width: CENTER_ICON_SIZE,
    height: CENTER_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbImage: {
    width: CENTER_ICON_SIZE,
    height: CENTER_ICON_SIZE,
  },
});
