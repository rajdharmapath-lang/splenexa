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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import BottomNav from '../../components/BottomNav';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';

const PDF_SUBJECTS = [
  { name: 'Anatomy' },
  { name: 'Physiology' },
  { name: 'Biochemistry' },
  { name: 'Radiology' },
  { name: 'Pharmacology' },
  { name: 'Pathology' },
  { name: 'Microbiology' },
  { name: 'Surgery' },
  { name: 'PSM' },
  { name: 'Internal Medicine' },
  { name: 'Obs-Gyne' },
  { name: 'Ophthalmology' },
  { name: 'Orthopedics' },
  { name: 'Pediatrics' },
  { name: 'Forensic Medicine' },
  { name: 'ENT' },
  { name: 'Psychiatry' },
  { name: 'Anesthesia' },
  { name: 'Dermatology' },
];

function PdfSubjectCard({ subject, width, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subject.name}
      onPress={() => onPress?.(subject)}
      style={({ pressed }) => [styles.subjectCardPressable, { width, opacity: pressed ? 0.9 : 1 }]}
    >
      <GlassCard
        {...glassCardEffects}
        radius={24}
        style={styles.subjectCard}
        contentStyle={styles.subjectCardContent}
      >
        <View style={styles.subjectIcon}>
          <Ionicons name="document-text-outline" size={42} color={theme.navy} />
        </View>
        <Text numberOfLines={2} style={styles.subjectName}>{subject.name}</Text>
      </GlassCard>
    </Pressable>
  );
}

export default function PdfScreen({ onBack, onNavigate, onNotificationPress, onOpenSubject }) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  const cardWidth = (screenWidth - 48 - 12) / 2;
  const visibleSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query
      ? PDF_SUBJECTS.filter((subject) => subject.name.toLowerCase().includes(query))
      : PDF_SUBJECTS;
  }, [searchQuery]);
  const rows = [];

  for (let index = 0; index < visibleSubjects.length; index += 2) {
    rows.push(visibleSubjects.slice(index, index + 2));
  }

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
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 120 },
        ]}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.headingGroup}>
            <Text style={styles.heading}>PDF Library</Text>
            <Text style={styles.subtitle}>Study notes by subject</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <GlassCard {...glassCardEffects} radius={18} contentStyle={styles.searchBar}>
          <TextInput
            accessibilityLabel="Search subjects or notes"
            autoCapitalize="none"
            onChangeText={setSearchQuery}
            placeholder="Search subjects or notes"
            placeholderTextColor={theme.muted}
            returnKeyType="search"
            style={styles.searchInput}
            value={searchQuery}
          />
        </GlassCard>

        {rows.length ? (
          <View style={styles.subjectGrid}>
            {rows.map((row, rowIndex) => (
              <View key={`pdf-row-${rowIndex}`} style={styles.subjectRow}>
                {row.map((subject) => (
                  <PdfSubjectCard
                    key={subject.name}
                    subject={subject}
                    width={cardWidth}
                    onPress={onOpenSubject}
                  />
                ))}
                {row.length === 1 ? <View style={{ width: cardWidth }} /> : null}
              </View>
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
        active="home"
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
    paddingHorizontal: 24,
    gap: 16,
  },
  header: {
    minHeight: 76,
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
    color: theme.navy,
    fontSize: 48,
    lineHeight: 52,
    fontFamily: typography.fontFamily.regular,
  },
  headingGroup: {
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    color: theme.navy,
    fontSize: 28,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    marginTop: 2,
    color: theme.muted,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
  },
  headerSpacer: {
    width: 44,
  },
  searchBar: {
    minHeight: 50,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchInput: {
    color: theme.navy,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
  subjectGrid: {
    gap: 12,
  },
  subjectRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subjectCardPressable: {
    flexShrink: 0,
  },
  subjectCard: {
    flex: 1,
  },
  subjectCardContent: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  subjectIcon: {
    width: 64,
    height: 64,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(170,220,245,0.35)',
  },
  subjectName: {
    color: theme.navy,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
  },
  emptyStateTitle: {
    color: theme.navy,
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
  emptyStateMessage: {
    marginTop: 6,
    color: theme.muted,
    fontSize: 15,
    fontFamily: typography.fontFamily.regular,
  },
});
