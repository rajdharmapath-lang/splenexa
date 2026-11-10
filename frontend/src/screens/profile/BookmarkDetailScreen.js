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
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard, { glassCardEffects, theme } from '../../components/GlassCard';
import typography from '../../theme/typography';

export default function BookmarkDetailScreen({ bookmark, onBack }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const correctAnswer = bookmark.options?.[bookmark.answer];
  const questionImageAspectRatio = bookmark.imageAspectRatio ?? 1.5;
  const explanationImageAspectRatio =
    bookmark.explanationImageAspectRatio ?? questionImageAspectRatio;
  const imageWidth = Math.min(width - 84, 420 * questionImageAspectRatio);
  const explanationImageWidth = Math.min(width - 84, 420 * explanationImageAspectRatio);
  const hasExplanation = Boolean(
    bookmark.explanation?.trim() || bookmark.explanationImage || bookmark.explanationTable,
  );

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
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28 },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Bookmarks"
            hitSlop={10}
            onPress={onBack}
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={30} color={theme.navy} />
          </Pressable>
          <Text style={styles.title}>Saved Question</Text>
          <View style={styles.headerSpacer} />
        </View>

        <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.metadataCard}>
          <Text style={styles.subject}>{bookmark.subjectName ?? 'General'}</Text>
          <Text style={styles.testTitle}>{bookmark.testTitle}</Text>
          <Text style={styles.category}>{bookmark.category}</Text>
        </GlassCard>

        <GlassCard {...glassCardEffects} radius={28} contentStyle={styles.questionCard}>
          <Text style={styles.sectionHeading}>Question</Text>
          <Text style={styles.questionText}>{bookmark.text}</Text>
          {bookmark.image ? (
            <Image
              source={bookmark.image}
              resizeMode="contain"
              style={[
                styles.questionImage,
                {
                  width: imageWidth,
                  height: imageWidth / questionImageAspectRatio,
                },
              ]}
              accessibilityLabel="Question image"
            />
          ) : null}
        </GlassCard>

        <Text style={styles.optionsHeading}>Options</Text>
        {bookmark.options?.length ? (
          <View style={styles.options}>
            {bookmark.options.map((option, index) => {
              const isCorrect = index === bookmark.answer;
              return (
                <GlassCard
                  key={`${bookmark.key}-option-${index}`}
                  {...glassCardEffects}
                  radius={20}
                  contentStyle={[styles.optionCard, isCorrect && styles.correctOptionCard]}
                >
                  <View style={[styles.optionLetter, isCorrect && styles.correctOptionLetter]}>
                    <Text style={[styles.optionLetterText, isCorrect && styles.correctOptionText]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, isCorrect && styles.correctOptionText]}>
                    {option}
                  </Text>
                  {isCorrect ? <Feather name="check-circle" size={20} color="#067B67" /> : null}
                </GlassCard>
              );
            })}
          </View>
        ) : (
          <GlassCard {...glassCardEffects} radius={20} contentStyle={styles.noticeCard}>
            <Text style={styles.noticeText}>No options were saved for this question.</Text>
          </GlassCard>
        )}

        <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.answerCard}>
          <Text style={styles.sectionHeading}>Correct answer</Text>
          <Text style={styles.answerText}>
            {correctAnswer
              ? `${String.fromCharCode(65 + bookmark.answer)}. ${correctAnswer}`
              : 'Correct answer unavailable'}
          </Text>
        </GlassCard>

        <GlassCard {...glassCardEffects} radius={24} contentStyle={styles.explanationCard}>
          <View style={styles.explanationHeading}>
            <Feather name="book-open" size={19} color={theme.teal} />
            <Text style={styles.sectionHeading}>Explanation</Text>
          </View>
          <Text style={styles.explanationText}>
            {bookmark.explanation?.trim()
              ? bookmark.explanation
              : !hasExplanation
                ? 'Explanation is not available for this question yet.'
                : null}
          </Text>
          {bookmark.explanationImage ? (
            <Image
              source={bookmark.explanationImage}
              resizeMode="contain"
              style={[
                styles.explanationImage,
                {
                  width: explanationImageWidth,
                  height: explanationImageWidth / explanationImageAspectRatio,
                },
              ]}
              accessibilityLabel="Explanation image"
            />
          ) : null}
          {bookmark.explanationTable ? (
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                {bookmark.explanationTable.headers.map((header) => (
                  <Text key={header} style={[styles.tableCell, styles.tableHeaderText]}>
                    {header}
                  </Text>
                ))}
              </View>
              {bookmark.explanationTable.rows.map((row, rowIndex) => (
                <View
                  key={`${row[0]}-${rowIndex}`}
                  style={[styles.tableRow, rowIndex === bookmark.explanationTable.rows.length - 1 && styles.tableLastRow]}
                >
                  {row.map((cell, cellIndex) => (
                    <Text key={`${cell}-${cellIndex}`} style={styles.tableCell}>
                      {cell}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          ) : null}
        </GlassCard>
      </ScrollView>
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
    gap: 14,
  },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
    fontSize: 24,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  headerSpacer: {
    width: 44,
  },
  metadataCard: {
    padding: 16,
  },
  subject: {
    color: theme.teal,
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
  testTitle: {
    marginTop: 3,
    color: theme.navy,
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
  },
  category: {
    marginTop: 2,
    color: theme.muted,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
  },
  questionCard: {
    padding: 20,
  },
  sectionHeading: {
    color: theme.navy,
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
  questionText: {
    marginTop: 8,
    color: theme.navy,
    fontSize: 17,
    lineHeight: 25,
    fontFamily: typography.fontFamily.semiBold,
  },
  questionImage: {
    alignSelf: 'center',
    marginTop: 16,
  },
  optionsHeading: {
    marginTop: 2,
    color: theme.navy,
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
  },
  options: {
    gap: 9,
  },
  optionCard: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  correctOptionCard: {
    borderColor: 'rgba(6,123,103,0.45)',
    backgroundColor: 'rgba(6,123,103,0.08)',
  },
  optionLetter: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(1,33,105,0.08)',
  },
  correctOptionLetter: {
    backgroundColor: 'rgba(6,123,103,0.14)',
  },
  optionLetterText: {
    color: theme.navy,
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
  },
  optionText: {
    flex: 1,
    color: '#33446F',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: typography.fontFamily.regular,
  },
  correctOptionText: {
    color: '#067B67',
    fontFamily: typography.fontFamily.bold,
  },
  noticeCard: {
    padding: 16,
  },
  noticeText: {
    color: theme.muted,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
  },
  answerCard: {
    padding: 18,
  },
  answerText: {
    marginTop: 7,
    color: '#067B67',
    fontSize: 15,
    lineHeight: 22,
    fontFamily: typography.fontFamily.bold,
  },
  explanationCard: {
    padding: 18,
  },
  explanationHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  explanationText: {
    marginTop: 9,
    color: '#33446F',
    fontSize: 14,
    lineHeight: 22,
    fontFamily: typography.fontFamily.regular,
  },
  explanationImage: {
    alignSelf: 'center',
    marginTop: 14,
  },
  table: {
    marginTop: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(1,33,105,0.12)',
    borderRadius: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(1,33,105,0.10)',
  },
  tableHeader: {
    backgroundColor: 'rgba(1,33,105,0.06)',
  },
  tableLastRow: {
    borderBottomWidth: 0,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    color: '#33446F',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: typography.fontFamily.regular,
  },
  tableHeaderText: {
    color: theme.navy,
    fontFamily: typography.fontFamily.bold,
  },
});
