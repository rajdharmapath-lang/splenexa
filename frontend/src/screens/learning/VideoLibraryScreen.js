import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import BottomNav from '../../components/BottomNav';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';

const SUBJECTS = [
  { key: 'anatomy', name: 'Anatomy', count: 12 },
  { key: 'physiology', name: 'Physiology', count: 10 },
  { key: 'biochemistry', name: 'Biochemistry', count: 8 },
  { key: 'microbiology', name: 'Microbiology', count: 9 },
  { key: 'pathology', name: 'Pathology', count: 11 },
  { key: 'pharmacology', name: 'Pharmacology', count: 14 },
  { key: 'forensic-medicine', name: 'Forensic Medicine', count: 0 },
  { key: 'psm', name: 'PSM', count: 0 },
  { key: 'ophthalmology', name: 'Ophthalmology', count: 0 },
  { key: 'ent', name: 'ENT', count: 0 },
  { key: 'medicine', name: 'Medicine', count: 0 },
  { key: 'surgery', name: 'Surgery', count: 7 },
  { key: 'obs-and-gynae', name: 'Obs and Gynae', count: 0 },
  { key: 'pediatrics', name: 'Pediatrics', count: 0 },
  { key: 'anaesthesia', name: 'Anaesthesia', count: 0 },
  { key: 'dermatology', name: 'Dermatology', count: 0 },
  { key: 'psychiatry', name: 'Psychiatry', count: 0 },
  { key: 'orthopaedics', name: 'Orthopaedics', count: 0 },
  { key: 'radiology', name: 'Radiology', count: 6 },
];

const SIDE = 20;
const GAP = 10;

function VideoIcon({ size = 40, color = theme.navy }) {
  return (
    <Svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 44 36"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <Rect x="2" y="4" width="30" height="28" rx="6" />
      <Path d="M13 12 L23 18 L13 24 Z" />
      <Path d="M33 15 L41 10 V26 L33 21 Z" />
    </Svg>
  );
}

function VideoSubjectCard({ subject, width, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${subject.name}, ${subject.count} videos`}
      onPress={() => onPress?.(subject)}
      style={({ pressed }) => [
        styles.subjectCardPressable,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <GlassCard
        {...glassCardEffects}
        style={styles.subjectCard}
        contentStyle={styles.subjectCardContent}
        radius={24}
      >
        <View style={styles.videoIconTile}>
          <VideoIcon />
        </View>
        <Text numberOfLines={1} style={styles.subjectName}>
          {subject.name}
        </Text>
        <Text style={styles.videoCount}>{subject.count} Videos</Text>
        <Feather name="chevron-right" size={24} color={theme.muted} style={styles.cardChevron} />
      </GlassCard>
    </Pressable>
  );
}

export default function VideoLibraryScreen({
  onBack,
  onNavigate,
  onNotificationPress,
  onOpenSubject,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const cardWidth = (width - SIDE * 2 - GAP) / 2;
  const visibleSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query
      ? SUBJECTS.filter((subject) => subject.name.toLowerCase().includes(query))
      : SUBJECTS;
  }, [searchQuery]);

  return (
    <LinearGradient
      colors={['#8CD9F9', '#A7F0F3', '#A2F8E0']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.background}
    >
      <StatusBar barStyle="dark-content" />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Home"
        hitSlop={12}
        onPress={onBack}
        style={[styles.backButton, { top: insets.top + 20 }]}
      >
        <Feather name="chevron-left" size={34} color={theme.navy} />
      </Pressable>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 28,
            paddingBottom: insets.bottom + 130,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Video Library</Text>
        <Text style={styles.subtitle}>Study videos by subject</Text>

        <GlassCard
          {...glassCardEffects}
          radius={26}
          style={styles.searchCard}
          contentStyle={styles.searchBar}
        >
          <Feather name="search" size={24} color="#1E9BD0" />
          <TextInput
            accessibilityLabel="Search subjects or videos"
            autoCapitalize="none"
            onChangeText={setSearchQuery}
            placeholder="Search subjects or videos"
            placeholderTextColor="#4F86B5"
            returnKeyType="search"
            style={styles.searchInput}
            value={searchQuery}
          />
          {searchQuery ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              onPress={() => setSearchQuery('')}
              hitSlop={8}
            >
              <Text style={styles.clearSearch}>×</Text>
            </Pressable>
          ) : null}
        </GlassCard>

        {visibleSubjects.length ? (
          <View style={styles.subjectGrid}>
            {visibleSubjects.map((subject) => (
              <VideoSubjectCard
                key={subject.key}
                subject={subject}
                width={cardWidth}
                onPress={onOpenSubject}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No subjects found</Text>
            <Text style={styles.emptyStateMessage}>Try a different search.</Text>
          </View>
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
    paddingHorizontal: SIDE,
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
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    marginTop: 2,
    color: theme.navy,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  searchCard: {
    marginTop: 18,
  },
  searchBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    color: theme.navy,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
  clearSearch: {
    color: theme.muted,
    fontSize: 25,
    fontFamily: typography.fontFamily.medium,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    marginTop: GAP + 2,
  },
  subjectCardPressable: {
    flexShrink: 0,
  },
  cardPressed: {
    opacity: 0.9,
  },
  subjectCard: {
  },
  subjectCardContent: {
    minHeight: 122,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 10,
  },
  videoIconTile: {
    width: 72,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(170,220,245,0.35)',
  },
  subjectName: {
    marginTop: 6,
    color: theme.navy,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  videoCount: {
    marginTop: 1,
    color: '#3F7FB0',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: typography.fontFamily.regular,
  },
  cardChevron: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  emptyState: {
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    color: theme.navy,
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
  },
  emptyStateMessage: {
    marginTop: 6,
    color: theme.muted,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
  },
});
