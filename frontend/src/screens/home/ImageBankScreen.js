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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import typography from '../../theme/typography';
import BottomNav from '../../components/BottomNav';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';

const SUBJECTS = [
  { key: 'anatomy', title: 'Anatomy', image: require('../../assets/images/subjects/Anatomy.png') },
  { key: 'physiology', title: 'Physiology', image: require('../../assets/images/subjects/Physiology.png') },
  { key: 'biochemistry', title: 'Biochemistry', image: require('../../assets/images/subjects/Biochemistry.png') },
  { key: 'radiology', title: 'Radiology', image: require('../../assets/images/subjects/Radiology.png') },
  { key: 'pharmacology', title: 'Pharmacology', image: require('../../assets/images/subjects/Pharmacology.png') },
  { key: 'pathology', title: 'Pathology', image: require('../../assets/images/subjects/Pathology.png') },
  { key: 'microbiology', title: 'Microbiology', image: require('../../assets/images/subjects/Microbiology.png') },
  { key: 'surgery', title: 'Surgery', image: require('../../assets/images/subjects/Surgery.png') },
  { key: 'psm', title: 'PSM', image: require('../../assets/images/subjects/PSM.png') },
  { key: 'internal-medicine', title: 'Internal Medicine', image: require('../../assets/images/subjects/Internal Medicine.png') },
  { key: 'obs-gyne', title: 'Obs-Gyne', image: require('../../assets/images/subjects/Obs-Gyne.png') },
  { key: 'ophthalmology', title: 'Ophthalmology', image: require('../../assets/images/subjects/Ophthalmology.png') },
  { key: 'orthopedics', title: 'Orthopedics', image: require('../../assets/images/subjects/Orthopedics.png') },
  { key: 'pediatrics', title: 'Pediatrics', image: require('../../assets/images/subjects/Pediatrics.png') },
  { key: 'forensic-medicine', title: 'Forensic Medicine', image: require('../../assets/images/subjects/Forensic Medicine.png') },
  { key: 'ent', title: 'ENT', image: require('../../assets/images/subjects/ENT.png') },
  { key: 'psychiatry', title: 'Psychiatry', image: require('../../assets/images/subjects/Psychiatry.png') },
  { key: 'anesthesia', title: 'Anesthesia', image: require('../../assets/images/subjects/Anesthesia.png') },
  { key: 'dermatology', title: 'Dermatology', image: require('../../assets/images/subjects/Dermatology.png') },
];

const SIDE = 22;
const GAP = 12;

function SubjectCard({ item, width, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [styles.subjectCardPressable, { width, opacity: pressed ? 0.9 : 1 }]}
    >
      <GlassCard
        {...glassCardEffects}
        radius={26}
        style={styles.subjectCard}
        contentStyle={{ height: width }}
      >
        <Image source={item.image} resizeMode="contain" style={styles.subjectImage} />
        <Text style={styles.subjectLabel} numberOfLines={1}>
          {item.title}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

export default function ImageBankScreen({
  onNavigate,
  onNotificationPress,
  onOpenSubject,
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardWidth = (width - SIDE * 2 - GAP) / 2;

  return (
    <LinearGradient
      colors={['#A9DDF8', '#B5F0F6', '#A2F8E0']}
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
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 130,
          },
        ]}
      >
        <Text style={styles.title}>Image Bank</Text>

        <View style={styles.grid}>
          {SUBJECTS.map((item) => (
            <SubjectCard
              key={item.key}
              item={item}
              width={cardWidth}
              onPress={onOpenSubject}
            />
          ))}
        </View>
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
    paddingHorizontal: SIDE,
  },
  title: {
    marginBottom: 22,
    color: theme.navy,
    fontSize: 32,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  subjectCardPressable: {
    flexShrink: 0,
  },
  subjectCard: {
    flex: 1,
  },
  subjectImage: {
    position: 'absolute',
    top: 9.2,
    left: 9.2,
    right: 9.2,
    bottom: 43.7,
    width: undefined,
    height: undefined,
  },
  subjectLabel: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 10,
    color: theme.navy,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
});
