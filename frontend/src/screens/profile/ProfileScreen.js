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
import BottomNav from '../../components/BottomNav';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';
import typography from '../../theme/typography';

function InfoLine({ icon, label, value }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.infoLine}>
      <View style={styles.infoIcon}>{icon}</View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoColon}>:</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

function MenuRow({ icon, title, subtitle, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle}`}
      onPress={onPress}
      style={({ pressed }) => [styles.menuPressable, pressed && styles.pressed]}
    >
      <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.menuRow}>
        <View style={styles.menuIcon}>{icon}</View>
        <View style={styles.menuCopy}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle} numberOfLines={1}>{subtitle}</Text>
        </View>
        <LinearGradient
          colors={['#4C6FE8', '#2FD9D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.menuArrow}
        >
          <Feather name="arrow-right" size={22} color="#FFFFFF" />
        </LinearGradient>
      </GlassCard>
    </Pressable>
  );
}

export default function ProfileScreen({
  userName = '',
  phoneNumber = '',
  stateName = '',
  batchYear = '',
  onNavigate,
  onNotificationPress,
  onOpenAttempts,
  onOpenPerformance,
  onOpenAnnotatedFiles,
  onOpenBookmarks,
  onSignOut,
}) {
  const insets = useSafeAreaInsets();
  const displayName = userName.trim() || 'Student';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <LinearGradient
      colors={['#B8F1FF', '#8FF0F7', '#B4FBE0']}
      locations={[0, 0.45, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <View pointerEvents="none" style={[styles.glow, styles.glowTop]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom]} />
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 126,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <GlassCard {...glassCardEffects} radius={28} contentStyle={styles.profileCard}>
          <LinearGradient
            colors={['#2F80ED', '#38D9E8', '#5EF2C3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>

          <View style={styles.profileInfo}>
            <Text style={styles.name} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.role}>FMGE Learner</Text>
            <InfoLine
              icon={<Feather name="map-pin" size={17} color={theme.teal} />}
              label="State"
              value={stateName}
            />
            <InfoLine
              icon={<MaterialCommunityIcons name="school-outline" size={19} color={theme.teal} />}
              label="Batch year"
              value={batchYear}
            />
            <InfoLine
              icon={<Feather name="phone" size={16} color={theme.teal} />}
              label="Phone"
              value={phoneNumber}
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>Study Activity</Text>
        <View style={styles.menuList}>
          <MenuRow
            icon={<MaterialCommunityIcons name="clipboard-check-outline" size={25} color={theme.teal} />}
            title="My Attempts"
            subtitle="Review your recent test activity"
            onPress={onOpenAttempts}
          />
          <MenuRow
            icon={<Feather name="trending-up" size={24} color={theme.teal} />}
            title="Performance"
            subtitle="View your learning performance"
            onPress={onOpenPerformance}
          />
          <MenuRow
            icon={<Feather name="file-text" size={24} color={theme.teal} />}
            title="Annotated Files"
            subtitle="Open your saved notes and annotations"
            onPress={onOpenAnnotatedFiles}
          />
          <MenuRow
            icon={<Feather name="bookmark" size={24} color={theme.teal} />}
            title="Bookmarks"
            subtitle="Open your saved questions"
            onPress={onOpenBookmarks}
          />
          <MenuRow
            icon={<Feather name="bell" size={24} color={theme.teal} />}
            title="Notification Settings"
            subtitle="Manage your notifications and updates"
            onPress={onNotificationPress}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          onPress={onSignOut}
          style={({ pressed }) => [styles.signOutPressable, pressed && styles.pressed]}
        >
          <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.signOutRow}>
            <Feather name="log-out" size={22} color="#C0445A" />
            <Text style={styles.signOutText}>Log Out</Text>
          </GlassCard>
        </Pressable>
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
  glow: {
    position: 'absolute',
    borderRadius: 999,
  },
  glowTop: {
    width: 280,
    height: 280,
    top: -80,
    right: -80,
    backgroundColor: 'rgba(120,210,255,0.28)',
  },
  glowBottom: {
    width: 300,
    height: 300,
    bottom: -100,
    left: -100,
    backgroundColor: 'rgba(170,255,220,0.3)',
  },
  content: {
    paddingHorizontal: 22,
  },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 30,
    lineHeight: 38,
    color: theme.navy,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontFamily: typography.fontFamily.semiBold,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 16,
  },
  name: {
    fontSize: 21,
    fontFamily: typography.fontFamily.bold,
    color: theme.navy,
  },
  role: {
    fontSize: 15,
    lineHeight: 21,
    fontFamily: typography.fontFamily.medium,
    color: theme.muted,
    marginBottom: 7,
  },
  infoLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  infoIcon: {
    width: 24,
    alignItems: 'flex-start',
  },
  infoLabel: {
    width: 78,
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: theme.muted,
  },
  infoColon: {
    fontSize: 13,
    color: theme.muted,
    marginRight: 6,
  },
  infoValue: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: typography.fontFamily.semiBold,
    color: theme.navy,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: typography.fontFamily.bold,
    color: theme.navy,
  },
  menuList: {
    gap: 10,
  },
  menuPressable: {
    width: '100%',
  },
  pressed: {
    opacity: 0.86,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.48)',
  },
  menuCopy: {
    flex: 1,
    minWidth: 0,
    marginHorizontal: 12,
  },
  menuTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: typography.fontFamily.bold,
    color: theme.navy,
  },
  menuSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: typography.fontFamily.regular,
    color: '#3D5A9E',
    marginTop: 2,
  },
  menuArrow: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutPressable: {
    marginTop: 10,
    marginBottom: 8,
  },
  signOutRow: {
    minHeight: 62,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  signOutText: {
    color: '#C0445A',
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
  },
});
