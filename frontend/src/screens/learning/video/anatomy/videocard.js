import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from '../../../../components/GlassCard';
import BottomNav from '../../../../components/BottomNav';
import typography from '../../../../theme/typography';

const GAP = 10;

function Avatar({ doctor }) {
  if (doctor.avatar) {
    return <Image source={doctor.avatar} style={styles.avatar} />;
  }

  const initials = doctor.name
    .replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('');

  return (
    <View style={[styles.avatar, styles.avatarFallback]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

function TypePill({ type }) {
  const isFeatured = type === 'featured';

  return (
    <View style={styles.pill}>
      {isFeatured ? (
        <MaterialCommunityIcons name="crown" size={16} color="#1AA8E8" />
      ) : (
        <MaterialCommunityIcons name="play-box-outline" size={16} color="#1AA8E8" />
      )}
      <Text style={styles.pillText}>{isFeatured ? 'Featured Video' : 'Video Lesson'}</Text>
    </View>
  );
}

function VideoCard({ video, thumbnailWidth, onPlay }) {
  const doctor = video.doctor ?? { name: 'Splenexa Faculty', role: 'Anatomy' };
  const watchedPercent = Math.round(Math.max(0, Math.min(1, video.progress ?? 0)) * 100);

  return (
    <Pressable
      onPress={() => onPlay?.(video)}
      accessibilityRole="button"
      accessibilityLabel={`${video.title}, ${video.duration}, ${watchedPercent} percent watched`}
      style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}
    >
      <GlassCard
        {...glassCardEffects}
        radius={26}
        contentStyle={styles.card}
      >
        <View style={[styles.thumbnailWrap, { width: thumbnailWidth }]}>
          <Image
            source={video.thumbnail ?? require('../../../../assets/images/home-video-thumbnail.png')}
            style={[styles.thumbnail, { width: thumbnailWidth }]}
            resizeMode="cover"
          />
          <View style={styles.playOverlay} pointerEvents="none">
            <View style={styles.playButton}>
              <Ionicons name="play" size={20} color={theme.navy} style={styles.playIcon} />
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <TypePill type={video.type} />
          <Text style={styles.videoTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            {video.title}
          </Text>

          <View style={styles.doctorRow}>
            <Avatar doctor={doctor} />
            <View style={styles.doctorCopy}>
              <Text style={styles.doctorName} numberOfLines={1}>{doctor.name}</Text>
              <Text style={styles.doctorRole} numberOfLines={1}>{doctor.role}</Text>
            </View>
            <View style={styles.duration}>
              <Feather name="clock" size={14} color={theme.navy} />
              <Text style={styles.durationText}>{video.duration}</Text>
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              {watchedPercent > 0 ? (
                <LinearGradient
                  colors={theme.accent}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${watchedPercent}%` }]}
                />
              ) : null}
            </View>
            <Text style={styles.progressPercent}>{watchedPercent}%</Text>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}

export default function AnatomyVideoCardScreen({
  title = 'Anatomy',
  subtitle = 'Video lectures by topic',
  videos = [],
  onBack,
  onPlay,
  onNavigate,
  onNotificationPress,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const thumbnailWidth = Math.round(width * 0.34);

  return (
    <LinearGradient
      colors={['#8CD9F9', '#A7F0F3', '#A2F8E0']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <Pressable
        onPress={onBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={[styles.backButton, { top: insets.top + 14 }]}
      >
        <Feather name="chevron-left" size={34} color={theme.navy} />
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 18,
            paddingBottom: insets.bottom + 130,
          },
        ]}
      >
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {videos.length > 0 ? (
          <View style={styles.videoList}>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                thumbnailWidth={thumbnailWidth}
                onPlay={onPlay}
              />
            ))}
          </View>
        ) : (
          <GlassCard
            {...glassCardEffects}
            radius={26}
            style={styles.emptyCard}
            contentStyle={styles.emptyCardContent}
          >
            <MaterialCommunityIcons name="play-box-outline" size={38} color={theme.blue} />
            <Text style={styles.emptyTitle}>No {title} videos available yet</Text>
            <Text style={styles.emptyMessage}>
              {title} video lessons will appear here when they are added.
            </Text>
          </GlassCard>
        )}
      </ScrollView>

      <BottomNav
        active="videos"
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
    paddingHorizontal: 18,
  },
  backButton: {
    position: 'absolute',
    left: 14,
    zIndex: 5,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    color: theme.navy,
    fontSize: 34,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    color: theme.navy,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 2,
    fontFamily: typography.fontFamily.regular,
  },
  videoList: {
    marginTop: 6,
    gap: GAP,
  },
  cardPressable: {
    width: '100%',
  },
  cardPressed: {
    opacity: 0.9,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  thumbnailWrap: {
    position: 'relative',
  },
  thumbnail: {
    height: 108,
    borderRadius: 18,
    backgroundColor: '#CFE6F3',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.88)',
  },
  playIcon: {
    marginLeft: 2,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: 'rgba(120,215,240,0.35)',
  },
  pillText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: '#1F4FB0',
  },
  videoTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 19,
    color: theme.navy,
    marginTop: 6,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CFE6F3',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: theme.navy,
  },
  doctorCopy: {
    flex: 1,
    marginLeft: 7,
    marginRight: 6,
  },
  doctorName: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12.5,
    color: theme.navy,
  },
  doctorRole: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 11.5,
    color: '#4F7DB8',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  durationText: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 12,
    color: theme.navy,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,190,235,0.35)',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressPercent: {
    width: 38,
    textAlign: 'right',
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 13,
    color: theme.navy,
  },
  emptyCard: {
    marginTop: 18,
  },
  emptyCardContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  emptyTitle: {
    marginTop: 12,
    color: theme.navy,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  emptyMessage: {
    marginTop: 6,
    color: theme.muted,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
});
