import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import BottomNav from '../../components/BottomNav';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';

const NOTIFICATIONS = [
  {
    id: 'anatomy-video',
    type: 'video',
    title: 'New Anatomy video released',
    message: 'A new lesson is ready in the Anatomy video library.',
    isNew: true,
  },
  {
    id: 'anatomy-pdf',
    type: 'pdf',
    title: 'New Anatomy PDF available',
    message: 'Open the Anatomy study material in the PDF library.',
    isNew: true,
  },
  {
    id: 'anatomy-image',
    type: 'image',
    title: 'New Anatomy images added',
    message: 'Explore the latest images in the Anatomy image bank.',
    isNew: true,
  },
  {
    id: 'grand-test-4',
    type: 'grandTest',
    title: 'Grand Test 4 is ready',
    message: 'Start the latest full-length Grand Test.',
    isNew: true,
  },
  {
    id: 'subject-wise-test',
    type: 'subjectTest',
    title: 'New subject-wise test available',
    message: 'Start an Anatomy subject-wise test.',
    isNew: true,
  },
  {
    id: 'qbank-anatomy',
    type: 'qbank',
    title: 'New Anatomy questions added',
    message: 'Practice the latest Anatomy Q-Bank questions.',
    isNew: true,
  },
  {
    id: 'image-based-test-4',
    type: 'imageTest',
    title: 'Image Based Test 4 is ready',
    message: 'Test your visual recognition with clinical images.',
    isNew: true,
  },
];

const ICON_BLUE = '#1A8FE8';

function TypeIcon({ type }) {
  switch (type) {
    case 'video':
      return <MaterialCommunityIcons name="play-box-outline" size={34} color={ICON_BLUE} />;
    case 'pdf':
      return (
        <View style={styles.iconBox}>
          <Ionicons name="document-outline" size={36} color={ICON_BLUE} />
          <Text style={styles.pdfLabel}>PDF</Text>
        </View>
      );
    case 'image':
      return <Ionicons name="image" size={34} color={ICON_BLUE} />;
    case 'grandTest':
      return <MaterialCommunityIcons name="text-box-check-outline" size={34} color={ICON_BLUE} />;
    case 'subjectTest':
      return <MaterialCommunityIcons name="clipboard-list-outline" size={34} color={ICON_BLUE} />;
    case 'qbank':
      return <Ionicons name="help-circle-outline" size={36} color={ICON_BLUE} />;
    case 'imageTest':
      return (
        <View style={styles.iconBox}>
          <Ionicons name="image-outline" size={34} color={ICON_BLUE} />
          <View style={styles.qBadge}>
            <Text style={styles.qBadgeText}>?</Text>
          </View>
        </View>
      );
    default:
      return <Ionicons name="notifications-outline" size={32} color={ICON_BLUE} />;
  }
}

function NotificationCard({ notification, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.message}${notification.isNew ? ' New.' : ''}`}
      onPress={() => onPress?.(notification.id)}
      style={({ pressed }) => [styles.cardGap, pressed && styles.notificationPressed]}
    >
      <GlassCard {...glassCardEffects} radius={26} contentStyle={styles.notificationCard}>
        <View style={styles.iconTile}>
          <TypeIcon type={notification.type} />
        </View>
        <View style={styles.notificationCopy}>
          <Text style={styles.notificationTitle} numberOfLines={2}>{notification.title}</Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
        </View>
        <View style={styles.rightColumn}>
          {notification.isNew ? (
            <View style={styles.newPill}>
              <Text style={styles.newText}>New</Text>
            </View>
          ) : null}
          <LinearGradient
            colors={['#4C6FE8', '#2FD9D0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.arrow}
          >
            <Feather name="chevron-right" size={22} color="#FFFFFF" />
          </LinearGradient>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function NotificationsScreen({
  onBack,
  onNavigate,
  onNotificationPress,
  onOpenNotification,
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={theme.bg}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Home"
            hitSlop={10}
            onPress={onBack}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={32} color={theme.navy} />
          </Pressable>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.notificationList}>
          {NOTIFICATIONS.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={onOpenNotification}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNav
        active="notifications"
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
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  headerSpacer: {
    width: 44,
  },
  notificationList: {
    marginTop: 14,
  },
  notificationPressed: {
    opacity: 0.88,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardGap: {
    marginBottom: 10,
  },
  iconTile: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(150,210,245,0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfLabel: {
    position: 'absolute',
    top: 17,
    fontFamily: typography.fontFamily.bold,
    fontSize: 9,
    color: ICON_BLUE,
  },
  qBadge: {
    position: 'absolute',
    right: -6,
    bottom: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#17C9B2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  qBadgeText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 11,
    color: '#FFFFFF',
    lineHeight: 14,
  },
  notificationCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 8,
  },
  notificationTitle: {
    color: theme.navy,
    fontSize: 17,
    lineHeight: 23,
    fontFamily: typography.fontFamily.bold,
  },
  notificationMessage: {
    marginTop: 3,
    color: theme.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: typography.fontFamily.regular,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newPill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(79,228,214,0.45)',
  },
  newText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: '#1B4FD0',
  },
  arrow: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
