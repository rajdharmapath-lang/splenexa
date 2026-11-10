import { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  Modal,
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
import ThemedAlert from '../../components/ThemedAlert';
import typography from '../../theme/typography';
import QUESTION_BANK from '../../data/questionBank';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const QUESTION_TIME_SECONDS = 60 * 60;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function AnswerOption({ label, text, state, onPress }) {
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';
  const isSelected = state === 'selected' || isCorrect;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Option ${label}: ${text}`}
      accessibilityState={{ selected: state !== 'default' }}
      onPress={onPress}
      style={styles.optionPressable}
    >
      <GlassCard
        {...glassCardEffects}
        radius={24}
        style={styles.optionGlass}
        contentStyle={[
          styles.optionCard,
          isCorrect && styles.optionCorrect,
          isIncorrect && styles.optionIncorrect,
        ]}
      >
        {isCorrect ? (
          <LinearGradient
            pointerEvents="none"
            colors={theme.accent}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <View style={[styles.optionLetter, isCorrect && styles.optionLetterCorrect]}>
          <Text style={[styles.optionLetterText, isCorrect && styles.optionTextCorrect]}>
            {label}
          </Text>
        </View>
        <Text style={[styles.optionText, isCorrect && styles.optionTextCorrect]}>{text}</Text>
        {isCorrect || isIncorrect ? (
          <View style={[styles.resultIndicator, isIncorrect && styles.resultIndicatorIncorrect]}>
            <Feather name={isCorrect ? 'check' : 'x'} size={17} color="#FFFFFF" />
          </View>
        ) : isSelected ? (
          <View style={styles.radioOn}>
            <View style={styles.radioDot} />
          </View>
        ) : (
          <View style={styles.radio} />
        )}
      </GlassCard>
    </Pressable>
  );
}

function ExplanationTable({ table }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        {table.headers.map((header) => (
          <Text key={header} style={[styles.tableCell, styles.tableHeaderText]}>
            {header}
          </Text>
        ))}
      </View>
      {table.rows.map((row, rowIndex) => (
        <View
          key={`${row[0]}-${rowIndex}`}
          style={[styles.tableRow, rowIndex === table.rows.length - 1 && styles.tableLastRow]}
        >
          {row.map((cell, cellIndex) => (
            <Text key={`${cell}-${cellIndex}`} style={styles.tableCell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function QuestionScreen({
  title = 'Practice Test',
  onBack,
  onFinish,
  onCancel,
  onProgressChange,
  bookmarkedKeys = [],
  bookmarkKeyPrefix = '',
  onToggleBookmark,
  questions = QUESTION_BANK,
}) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [timeRemaining, setTimeRemaining] = useState(QUESTION_TIME_SECONDS);
  const [activePanel, setActivePanel] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const question = questions[questionIndex];
  const isBookmarked = bookmarkedKeys.includes(
    `${bookmarkKeyPrefix}${question.id ?? question.text}`,
  );
  const progress = (questionIndex + 1) / questions.length;
  const isLastQuestion = questionIndex === questions.length - 1;
  const selectedOption = answers[questionIndex] ?? null;
  const submitted = selectedOption !== null && !onFinish;
  const attemptedCount = answers.filter((answer) => answer !== null).length;
  const imageAspectRatio = question.imageAspectRatio || 1.5;
  const imageWidth = Math.min(screenWidth - 44 - 20, 420 * imageAspectRatio);
  const imageHeight = imageWidth / imageAspectRatio;

  useEffect(() => {
    onProgressChange?.({ attempted: attemptedCount, total: questions.length });
  }, [attemptedCount, onProgressChange, questions.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((remaining) => Math.max(remaining - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setActivePanel('menu');
      return true;
    });
    return () => subscription.remove();
  }, []);

  function changeQuestion(nextIndex) {
    setQuestionIndex(nextIndex);
  }

  function finishTest() {
    const correct = answers.reduce(
      (count, answer, index) => count + (answer === questions[index].answer ? 1 : 0),
      0,
    );
    const attempted = answers.filter((answer) => answer !== null).length;
    const incorrect = attempted - correct;
    const unanswered = questions.length - attempted;
    const accuracy = attempted ? (correct / attempted) * 100 : 0;
    const percentage = questions.length ? (correct / questions.length) * 100 : 0;
    const elapsedMinutes = Math.floor((QUESTION_TIME_SECONDS - timeRemaining) / 60);
    const hours = Math.floor(elapsedMinutes / 60);
    const minutes = elapsedMinutes % 60;

    setActivePanel(null);
    onFinish?.({
      testTitle: title,
      subtitle: 'Your test results',
      score: correct,
      total: questions.length,
      rank: null,
      accuracy: `${accuracy.toFixed(1)}%`,
      percentage: `${percentage.toFixed(1)}%`,
      timeSpent: `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`,
      correct,
      incorrect,
      unanswered,
      isEvaluated: true,
      subjects: [],
      leaderboard: [],
    });
  }

  function requestSubmit() {
    setActivePanel(null);
    if (!onFinish) {
      return;
    }

    setConfirmation({
      title: 'Submit test?',
      message: `You have attempted ${attemptedCount} of ${questions.length} questions. You cannot retry after submitting.`,
      actions: [
        { label: 'Continue test', variant: 'secondary' },
        { label: 'Submit', variant: 'primary', onPress: finishTest },
      ],
    });
  }

  function requestCancel() {
    setActivePanel(null);
    const isTest = Boolean(onCancel);
    setConfirmation({
      title: isTest ? 'Cancel test?' : 'Leave practice?',
      message: isTest
        ? 'Your progress will be discarded, and you will not be able to attempt this test again.'
        : 'Leave this practice screen?',
      actions: [
        { label: isTest ? 'Keep testing' : 'Stay here', variant: 'secondary' },
        {
          label: isTest ? 'Cancel test' : 'Leave',
          variant: 'destructive',
          onPress: () => {
            onCancel?.();
            if (!onCancel) {
              onBack?.();
            }
          },
        },
      ],
    });
  }

  return (
    <LinearGradient
      colors={['#BFEBFB', '#B7F3F8', '#A8F8E5']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <StatusBar barStyle="dark-content" />
      <View style={[styles.screenContent, { paddingTop: insets.top + 48 }]}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open test actions"
            onPress={() => setActivePanel('menu')}
            hitSlop={10}
            style={styles.headerButton}
          >
            <Feather name="menu" size={22} color="#10166B" />
          </Pressable>
          <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
            accessibilityState={{ selected: isBookmarked }}
            onPress={() => onToggleBookmark?.(question, isBookmarked)}
            style={styles.headerButton}
          >
            <Feather
              name="bookmark"
              size={22}
              color={isBookmarked ? '#00AFC4' : '#10166B'}
              fill={isBookmarked ? '#00AFC4' : 'transparent'}
            />
          </Pressable>
        </View>

        <GlassCard
          {...glassCardEffects}
          radius={24}
          style={styles.progressCard}
          contentStyle={styles.progressCardContent}
        >
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>Test progress</Text>
            <View style={styles.timer}>
              <Feather name="clock" size={21} color={theme.blue} />
              <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            </View>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: questions.length, now: questionIndex + 1 }}
            style={styles.progressTrack}
          >
            <LinearGradient
              colors={theme.accent}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </GlassCard>

        <ScrollView
          style={styles.questionScroll}
          contentContainerStyle={[
            styles.questionContent,
            { paddingBottom: 20 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard
            {...glassCardEffects}
            radius={28}
            style={styles.questionCard}
            contentStyle={styles.questionCardContent}
          >
            <Text style={styles.questionText}>{question.text}</Text>
          </GlassCard>
          {question.image ? (
            <GlassCard
              {...glassCardEffects}
              radius={20}
              style={styles.imageFrame}
              contentStyle={styles.imageFrameContent}
            >
              <Image
                source={question.image}
                resizeMode="contain"
                style={[
                  styles.questionImage,
                  { width: imageWidth, height: imageHeight },
                ]}
                accessibilityLabel={`Question ${question.id} medical image`}
              />
            </GlassCard>
          ) : null}

          <Text style={styles.sectionHeading}>Choose the correct answer</Text>
          <View style={styles.options}>
            {question.options.map((option, index) => {
              let state = selectedOption === index ? 'selected' : 'default';
              if (submitted && index === question.answer) {
                state = 'correct';
              } else if (submitted && selectedOption === index) {
                state = 'incorrect';
              }

              return (
                <AnswerOption
                  key={`${question.id}-${option}`}
                  label={OPTION_LABELS[index]}
                  text={option}
                  state={state}
                  onPress={() => {
                    setAnswers((currentAnswers) => {
                      const nextAnswers = [...currentAnswers];
                      nextAnswers[questionIndex] = index;
                      return nextAnswers;
                    });
                  }}
                />
              );
            })}
          </View>

          {submitted ? (
            <GlassCard
              {...glassCardEffects}
              radius={24}
              contentStyle={styles.answerFeedbackCard}
            >
              <View
                accessibilityLiveRegion="polite"
                style={[
                  styles.answerFeedback,
                  selectedOption === question.answer
                    ? styles.correctFeedback
                    : styles.incorrectFeedback,
                ]}
              >
                {selectedOption === question.answer ? (
                  <LinearGradient
                    pointerEvents="none"
                    colors={theme.accent}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
                <Text
                  style={[
                    styles.feedbackIcon,
                    selectedOption === question.answer && styles.feedbackTextCorrect,
                  ]}
                >
                  {selectedOption === question.answer ? '✓' : '×'}
                </Text>
                <Text
                  style={[
                    styles.feedbackText,
                    selectedOption === question.answer && styles.feedbackTextCorrect,
                  ]}
                >
                  {selectedOption === question.answer
                    ? 'Your answer is correct.'
                    : `Incorrect. Correct answer: ${OPTION_LABELS[question.answer]}.`}
                </Text>
              </View>
            </GlassCard>
          ) : null}

          {submitted && question.explanation ? (
            <GlassCard
              {...glassCardEffects}
              radius={28}
              contentStyle={styles.explanationCard}
            >
              <View style={styles.explanationHeadingRow}>
                <Text style={styles.explanationCheck}>✓</Text>
                <Text style={styles.explanationHeading}>Explanation</Text>
              </View>
              <Text style={styles.explanationText}>{question.explanation}</Text>
              {question.explanationImage ? (
                <GlassCard
                  {...glassCardEffects}
                  radius={20}
                  style={styles.explanationImageFrame}
                  contentStyle={styles.explanationImageFrameContent}
                >
                  <Image
                    source={question.explanationImage}
                    resizeMode="contain"
                    style={[
                      styles.explanationImage,
                      {
                        aspectRatio:
                          question.explanationImageAspectRatio ??
                          question.imageAspectRatio ??
                          1.5,
                      },
                    ]}
                    accessibilityLabel="Explanation medical image"
                  />
                </GlassCard>
              ) : null}
              {question.explanationTable ? (
                <ExplanationTable table={question.explanationTable} />
              ) : null}
            </GlassCard>
          ) : null}
        </ScrollView>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open test actions"
        accessibilityState={{ expanded: activePanel !== null }}
        onPress={() => setActivePanel('menu')}
        style={[styles.attemptFab, { bottom: Math.max(insets.bottom, 12) + 72 }]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={theme.accent}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.attemptFabGradient}
        />
        <Feather name="menu" size={26} color="#FFFFFF" />
      </Pressable>
      <Modal
        animationType="fade"
        transparent
        visible={activePanel !== null}
        onRequestClose={() => setActivePanel(null)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close test actions"
            onPress={() => setActivePanel(null)}
            style={StyleSheet.absoluteFill}
          />
          {activePanel === 'menu' ? (
            <GlassCard
              {...glassCardEffects}
              radius={20}
              style={[styles.actionMenu, { bottom: Math.max(insets.bottom, 12) + 136 }]}
              contentStyle={styles.actionMenuContent}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => setActivePanel('attempts')}
                style={styles.actionMenuItem}
              >
                <Feather name="grid" size={19} color="#10166B" />
                <Text style={styles.actionMenuText}>Attempt</Text>
              </Pressable>
              {onFinish ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={requestSubmit}
                  style={styles.actionMenuItem}
                >
                  <Feather name="check-circle" size={19} color="#10166B" />
                  <Text style={styles.actionMenuText}>Submit</Text>
                </Pressable>
              ) : null}
              <Pressable
                accessibilityRole="button"
                onPress={requestCancel}
                style={styles.actionMenuItem}
              >
                <Feather name="x-circle" size={19} color="#D62839" />
                <Text style={[styles.actionMenuText, styles.cancelMenuText]}>Cancel</Text>
              </Pressable>
            </GlassCard>
          ) : activePanel === 'attempts' ? (
            <GlassCard
              {...glassCardEffects}
              radius={26}
              style={styles.attemptPanel}
              contentStyle={styles.attemptPanelContent}
            >
              <View style={styles.attemptPanelHeader}>
                <Text style={styles.attemptPanelTitle}>Questions</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Close question list"
                  onPress={() => setActivePanel(null)}
                  style={styles.closeAttemptButton}
                >
                  <Feather name="x" size={22} color="#10166B" />
                </Pressable>
              </View>
              <Text style={styles.attemptCount}>
                Attempted <Text style={styles.attemptCountNumber}>{attemptedCount}</Text>
                {' / '}{questions.length}
              </Text>
              <ScrollView
                style={styles.questionGridScroll}
                contentContainerStyle={styles.questionGrid}
                showsVerticalScrollIndicator={false}
              >
                {questions.map((item, index) => {
                  const isAttempted = answers[index] !== null;
                  const isCurrent = index === questionIndex;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Go to question ${index + 1}${isAttempted ? ', attempted' : ', not attempted'}`}
                      onPress={() => {
                        changeQuestion(index);
                        setActivePanel(null);
                      }}
                      style={styles.questionGridItemPressable}
                    >
                      <GlassCard
                        {...glassCardEffects}
                        radius={21}
                        strokeOpacity={0}
                        style={styles.questionGridItemGlass}
                        contentStyle={[
                          styles.questionGridItem,
                          isAttempted && styles.questionGridItemAttempted,
                          isCurrent && styles.questionGridItemCurrent,
                        ]}
                      >
                        <Text
                          style={[
                            styles.questionGridNumber,
                            isAttempted && styles.questionGridNumberAttempted,
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </GlassCard>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <View style={styles.questionLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotAttempted]} />
                  <Text style={styles.legendText}>Attempted</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotUnattempted]} />
                  <Text style={styles.legendText}>Not attempted</Text>
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setActivePanel(null)}
                style={styles.closeAttemptAction}
              >
                <LinearGradient
                  pointerEvents="none"
                  colors={theme.accent}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={styles.closeAttemptGradient}
                />
                <Text style={styles.closeAttemptText}>Close</Text>
              </Pressable>
            </GlassCard>
          ) : null}
        </View>
      </Modal>
      <ThemedAlert
        visible={confirmation !== null}
        title={confirmation?.title}
        message={confirmation?.message}
        contentPadding={22}
        actions={confirmation?.actions.map((action) => ({
          ...action,
          onPress: () => {
            setConfirmation(null);
            action.onPress?.();
          },
        }))}
        onRequestClose={() => setConfirmation(null)}
      />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous question"
          accessibilityState={{ disabled: questionIndex === 0 }}
          disabled={questionIndex === 0}
          onPress={() => changeQuestion(questionIndex - 1)}
          style={[styles.footerButton, questionIndex === 0 && styles.navigationDisabled]}
        >
          <Feather name="arrow-left" size={20} color="#10166B" />
          <Text style={styles.footerPreviousText}>Previous</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isLastQuestion && onFinish
              ? 'Open test actions'
              : isLastQuestion
                ? 'Restart questions'
                : 'Next question'
          }
          onPress={() => {
            if (isLastQuestion && onFinish) {
              setActivePanel('menu');
              return;
            }
            changeQuestion((questionIndex + 1) % questions.length);
          }}
          style={styles.footerNextButton}
        >
          <LinearGradient
            pointerEvents="none"
            colors={theme.accent}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.footerNextGradient}
          />
          <Text style={styles.footerNextText}>
            {isLastQuestion ? (onFinish ? 'Test options' : 'Restart') : 'Next'}
          </Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: 22,
  },
  header: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.60)',
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    color: '#10166B',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  progressCard: {
    marginHorizontal: 0,
    marginTop: 12,
  },
  progressCardContent: {
    padding: 18,
  },
  progressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressLabel: {
    color: '#10166B',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    color: '#10166B',
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    fontFamily: typography.fontFamily.semiBold,
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: 'rgba(16,22,107,0.12)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  questionScroll: {
    flex: 1,
    marginTop: 12,
  },
  questionContent: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    gap: 14,
  },
  questionCard: {
    width: '100%',
  },
  questionCardContent: {
    padding: 18,
  },
  questionText: {
    color: '#100568',
    fontSize: 21,
    lineHeight: 29,
    fontFamily: typography.fontFamily.semiBold,
    marginTop: 0,
  },
  imageFrame: {
    width: '100%',
  },
  imageFrameContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  questionImage: {
    borderRadius: 18,
  },
  sectionHeading: {
    marginTop: 2,
    color: '#100568',
    fontSize: 18,
    fontFamily: typography.fontFamily.semiBold,
  },
  options: {
    gap: 10,
  },
  optionPressable: {
    width: '100%',
  },
  optionGlass: {
    width: '100%',
  },
  optionCard: {
    position: 'relative',
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionCorrect: {
    backgroundColor: 'transparent',
  },
  optionIncorrect: {
    backgroundColor: 'rgba(229,72,77,0.14)',
  },
  optionLetter: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: 'rgba(160,210,245,0.45)',
  },
  optionLetterText: {
    color: '#100568',
    fontSize: 17,
    fontFamily: typography.fontFamily.bold,
  },
  optionLetterCorrect: {
    backgroundColor: 'rgba(255,255,255,0.24)',
  },
  optionTextCorrect: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    color: '#100568',
    fontSize: 17,
    lineHeight: 24,
    fontFamily: typography.fontFamily.semiBold,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#8FA6D6',
  },
  radioOn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.65)',
    shadowColor: '#0AA',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  radioDot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#0FB5B0',
  },
  resultIndicator: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#13A98B',
  },
  resultIndicatorIncorrect: {
    backgroundColor: '#E5484D',
  },
  answerFeedback: {
    position: 'relative',
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  correctFeedback: {
    backgroundColor: 'transparent',
  },
  incorrectFeedback: {
    backgroundColor: 'rgba(228,123,138,0.18)',
  },
  feedbackIcon: {
    color: '#087B65',
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
  },
  answerFeedbackCard: {
    paddingHorizontal: 16,
  },
  feedbackText: {
    flex: 1,
    color: '#100568',
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
  },
  feedbackTextCorrect: {
    color: '#FFFFFF',
  },
  explanationCard: {
    padding: 18,
  },
  explanationHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationCheck: {
    color: '#078769',
    fontSize: 21,
    fontFamily: typography.fontFamily.bold,
  },
  explanationHeading: {
    color: '#100568',
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
  },
  explanationText: {
    color: '#25316F',
    fontSize: 15,
    lineHeight: 23,
    fontFamily: typography.fontFamily.regular,
  },
  explanationImageFrame: {
    marginTop: 14,
  },
  explanationImageFrameContent: {
    alignItems: 'center',
    padding: 8,
  },
  explanationImage: {
    width: '100%',
    maxHeight: 320,
  },
  table: {
    marginTop: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16,22,107,0.16)',
    borderRadius: 14,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16,22,107,0.12)',
    backgroundColor: 'rgba(255,255,255,0.48)',
  },
  tableHeader: {
    backgroundColor: 'rgba(0,201,232,0.16)',
  },
  tableLastRow: {
    borderBottomWidth: 0,
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#100568',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: typography.fontFamily.regular,
  },
  tableHeaderText: {
    fontFamily: typography.fontFamily.semiBold,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 22,
    paddingTop: 8,
    backgroundColor: 'rgba(190,240,247,0.35)',
  },
  footerButton: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  footerNextButton: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
    backgroundColor: 'transparent',
    shadowColor: '#005B78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  footerNextGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
  },
  navigationDisabled: {
    opacity: 0.42,
  },
  attemptFab: {
    position: 'absolute',
    right: 22,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: 'transparent',
    elevation: 6,
    shadowColor: '#10166B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  attemptFabGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(10,18,70,0.48)',
  },
  actionMenu: {
    position: 'absolute',
    right: 22,
    width: 190,
  },
  actionMenuContent: {
    padding: 8,
  },
  actionMenuItem: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  actionMenuText: {
    color: '#10166B',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  cancelMenuText: {
    color: '#D62839',
  },
  attemptPanel: {
    width: '100%',
  },
  attemptPanelContent: {
    padding: 22,
  },
  attemptPanelHeader: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attemptPanelTitle: {
    flex: 1,
    color: '#100568',
    fontSize: 22,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },
  closeAttemptButton: {
    position: 'absolute',
    right: -10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  attemptCount: {
    marginTop: 8,
    marginBottom: 18,
    color: '#100568',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: typography.fontFamily.semiBold,
  },
  attemptCountNumber: {
    color: '#D62839',
    fontFamily: typography.fontFamily.bold,
  },
  questionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  questionGridScroll: {
    maxHeight: 300,
    flexGrow: 0,
  },
  questionLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 18,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendDotAttempted: {
    backgroundColor: '#012169',
  },
  legendDotUnattempted: {
    backgroundColor: '#9299A8',
  },
  legendText: {
    color: '#44516E',
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
  },
  questionGridItem: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,22,107,0.22)',
    borderRadius: 21,
    backgroundColor: 'transparent',
  },
  questionGridItemAttempted: {
    borderColor: '#012169',
    backgroundColor: '#012169',
  },
  questionGridItemPressable: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  questionGridItemGlass: {
    width: 42,
    height: 42,
  },
  questionGridItemCurrent: {
    borderWidth: 2,
    borderColor: '#10166B',
  },
  questionGridNumber: {
    color: '#10166B',
    fontSize: 15,
    fontFamily: typography.fontFamily.semiBold,
  },
  questionGridNumberAttempted: {
    color: '#FFFFFF',
    fontFamily: typography.fontFamily.bold,
  },
  closeAttemptAction: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  closeAttemptGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
  },
  closeAttemptText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
  },
  footerPreviousText: {
    color: '#100568',
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
  },
  footerNextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
});
