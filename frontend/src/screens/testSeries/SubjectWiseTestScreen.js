import {
  Image,
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

const SUBJECTS = [
  { id: 'anatomy', name: 'Anatomy', icon: require('../../assets/images/subjects/icons/anatomy.png') },
  { id: 'physiology', name: 'Physiology', icon: require('../../assets/images/subjects/icons/physiology.png') },
  { id: 'biochemistry', name: 'Biochemistry', icon: require('../../assets/images/subjects/icons/biochemistry.png') },
  { id: 'psm', name: 'PSM', icon: require('../../assets/images/subjects/icons/psm.png') },
  { id: 'pharmacology', name: 'Pharmacology', icon: require('../../assets/images/subjects/icons/pharmacology.png') },
  { id: 'pathology', name: 'Pathology', icon: require('../../assets/images/subjects/icons/pathology.png') },
  { id: 'microbiology', name: 'Microbiology', icon: require('../../assets/images/subjects/icons/microbiology.png') },
  { id: 'internal-medicine', name: 'Internal Medicine', icon: require('../../assets/images/subjects/icons/internal-medicine.png') },
  { id: 'surgery', name: 'Surgery', icon: require('../../assets/images/subjects/icons/surgery.png') },
  { id: 'obs-gyne', name: 'Obs-Gyne', icon: require('../../assets/images/subjects/icons/obs-gyne.png') },
  { id: 'ophthalmology', name: 'Ophthalmology', icon: require('../../assets/images/subjects/icons/ophthalmology.png') },
  { id: 'orthopedics', name: 'Orthopedics', icon: require('../../assets/images/subjects/icons/orthopedics.png') },
  { id: 'pediatrics', name: 'Pediatrics', icon: require('../../assets/images/subjects/icons/pediatrics.png') },
  { id: 'forensic-medicine', name: 'Forensic Medicine', icon: require('../../assets/images/subjects/icons/forensic-medicine.png') },
  { id: 'ent', name: 'ENT', icon: require('../../assets/images/subjects/icons/ent.png') },
  { id: 'radiology', name: 'Radiology', icon: require('../../assets/images/subjects/icons/radiology.png') },
  { id: 'psychiatry', name: 'Psychiatry', icon: require('../../assets/images/subjects/icons/psychiatry.png') },
  { id: 'anesthesia', name: 'Anesthesia', icon: require('../../assets/images/subjects/icons/anesthesia.png') },
  { id: 'dermatology', name: 'Dermatology', icon: require('../../assets/images/subjects/icons/dermatology.png') },
];

function SubjectIcon({ source, name }) {
  return <Image source={source} style={styles.subjectIcon} accessibilityLabel={`${name} icon`} />;
}

function BottomNavigation({ onNavigate, onNotificationPress }) {
  return <BottomNav active="tests" onNavigate={onNavigate} onNotificationPress={onNotificationPress} />;
}

function SubjectCard({ subject, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${subject.name}, 0 of 75 questions completed`}
      onPress={() => onPress?.(subject)}
      style={styles.subjectCardPressable}
    >
      {({ pressed }) => (
        <GlassCard
          {...glassCardEffects}
          style={[styles.subjectCard, pressed && styles.cardPressed]}
          contentStyle={styles.subjectCardContent}
          radius={24}
        >
          <SubjectIcon source={subject.icon} name={subject.name} />
          <Text numberOfLines={2} style={styles.subjectName}>
            {subject.name}
          </Text>
          <Text style={styles.progress}>0/75</Text>
          <LinearGradient
            colors={['#4C6FE8', '#4FE4BA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.arrowCircle}
          >
            <Text style={styles.arrow}>→</Text>
          </LinearGradient>
        </GlassCard>
      )}
    </Pressable>
  );
}

export default function SubjectWiseTestScreen({
  title = 'Subject-wise Test',
  onBack,
  onNavigate,
  onNotificationPress,
  onOpenSubject,
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
          <Text style={styles.heading}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.subjectList}>
          {SUBJECTS.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onPress={onOpenSubject}
            />
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
    gap: 16,
  },
  pageHeader: {
    minHeight: 78,
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
  heading: {
    flex: 1,
    color: '#100568',
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  headerSpacer: {
    width: 36,
  },
  subjectList: {
    gap: 12,
  },
  subjectCard: {
    flex: 1,
  },
  subjectCardPressable: {
    width: '100%',
  },
  subjectCardContent: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 22,
  },
  cardPressed: {
    opacity: 0.88,
  },
  subjectIcon: {
    width: 52,
    height: 52,
    flexShrink: 0,
    borderRadius: 12,
  },
  progress: {
    minWidth: 42,
    color: '#5778A4',
    fontSize: 16,
    textAlign: 'right',
    fontFamily: typography.fontFamily.regular,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
    fontFamily: typography.fontFamily.medium,
  },
  subjectName: {
    flex: 1,
    color: '#100568',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: typography.fontFamily.bold,
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
