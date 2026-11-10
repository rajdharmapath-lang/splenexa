import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';
import BottomNav from '../../components/BottomNav';
import typography from '../../theme/typography';

function BookmarkCard({ bookmark, onOpen, onRemove }) {
  return (
    <View style={styles.bookmarkCard}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${bookmark.subjectName ?? 'General'} question from ${bookmark.testTitle}`}
        onPress={() => onOpen(bookmark.key)}
        style={styles.bookmarkPressable}
      >
        <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.bookmarkCardContent}>
          <View style={styles.bookmarkCopy}>
            <Text style={styles.bookmarkSubject}>{bookmark.subjectName ?? 'General'}</Text>
            <Text style={styles.bookmarkTitle} numberOfLines={2}>{bookmark.testTitle}</Text>
            <Text style={styles.bookmarkCategory}>{bookmark.category}</Text>
          </View>
          <Text style={styles.questionText} numberOfLines={3}>{bookmark.text}</Text>
          <View style={styles.openHint}>
            <Text style={styles.openHintText}>View question and explanation</Text>
            <Feather name="chevron-right" size={18} color={theme.teal} />
          </View>
        </GlassCard>
      </Pressable>
      <View style={styles.removeButtonContainer}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Remove bookmarked question"
          onPress={() => onRemove(bookmark.key)}
          hitSlop={8}
          style={styles.removeButton}
        >
          <Feather name="bookmark" size={20} color={theme.teal} />
        </Pressable>
      </View>
    </View>
  );
}

export default function BookmarksScreen({
  bookmarks,
  loadError,
  onOpen,
  onRemove,
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
          <Text style={styles.title}>Bookmarks</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loadError ? (
          <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Bookmarks unavailable</Text>
            <Text style={styles.emptyMessage}>
              The app couldn’t load your saved questions. Please restart the app and try again.
            </Text>
          </GlassCard>
        ) : bookmarks.length ? (
          <View style={styles.bookmarkList}>
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.key}
                bookmark={bookmark}
                onOpen={onOpen}
                onRemove={onRemove}
              />
            ))}
          </View>
        ) : (
          <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.emptyCard}>
            <Feather name="bookmark" size={34} color={theme.teal} />
            <Text style={styles.emptyTitle}>No bookmarked questions</Text>
            <Text style={styles.emptyMessage}>
              Tap the bookmark icon while viewing a test question to save it here.
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
  bookmarkList: {
    gap: 12,
  },
  bookmarkCard: {
    position: 'relative',
  },
  bookmarkPressable: {
    borderRadius: 24,
  },
  bookmarkCardContent: {
    padding: 18,
    paddingRight: 58,
  },
  bookmarkCopy: {
    gap: 2,
  },
  bookmarkSubject: {
    color: theme.teal,
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
  },
  bookmarkTitle: {
    color: theme.navy,
    fontSize: 17,
    lineHeight: 23,
    fontFamily: typography.fontFamily.bold,
  },
  bookmarkCategory: {
    marginTop: 2,
    color: theme.muted,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  questionText: {
    marginTop: 14,
    color: theme.navy,
    fontSize: 16,
    lineHeight: 23,
    fontFamily: typography.fontFamily.semiBold,
  },
  openHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  openHintText: {
    color: theme.teal,
    fontSize: 13,
    fontFamily: typography.fontFamily.semiBold,
  },
  removeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  removeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
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
