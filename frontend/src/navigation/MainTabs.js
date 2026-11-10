import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import ThemedAlert from '../components/ThemedAlert';
import HomeScreen from '../screens/home/HomeScreen';
import ImageBankScreen from '../screens/home/ImageBankScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';
import PdfScreen from '../screens/home/pdfscreen';
import GrandTestScreen from '../screens/testSeries/GrandTestScreen';
import ImageBasedTestScreen from '../screens/testSeries/ImageBasedTestScreen';
import QBankScreen from '../screens/testSeries/QBankScreen';
import SubjectWiseTestScreen from '../screens/testSeries/SubjectWiseTestScreen';
import TestSeriesScreen from '../screens/testSeries/TestSeriesScreen';
import QuestionScreen from '../screens/testSeries/QuestionScreen';
import GrandTestResultScreen from '../screens/testSeries/GrandTestResultScreen';
import ImageBasedTestResultScreen from '../screens/testSeries/ImageBasedTestResultScreen';
import VideoLibraryScreen from '../screens/learning/VideoLibraryScreen';
import AnatomyVideoCardScreen from '../screens/learning/video/anatomy/videocard';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MyAttemptsScreen from '../screens/profile/MyAttemptsScreen';
import BookmarksScreen from '../screens/profile/BookmarksScreen';
import BookmarkDetailScreen from '../screens/profile/BookmarkDetailScreen';
import PreviewDetailScreen from '../screens/PreviewDetailScreen';
import DailyQuestionScreen from '../screens/home/DailyQuestionScreen';
import QUESTION_BANK from '../data/questionBank';

const TEST_LOCKS_STORAGE_KEY = 'splenexa.test-locks.v1';
const TEST_HISTORY_STORAGE_KEY = 'splenexa.test-history.v1';
const BOOKMARKS_INDEX_STORAGE_KEY = 'splenexa.bookmarks.index.v2';
const BOOKMARK_STORAGE_KEY_PREFIX = 'splenexa.bookmark.v2.';
const LEARNING_STREAK_STORAGE_KEY = 'splenexa.learning-streak.v1';
const STREAK_RESET_DATE = '2026-11-07';
const STREAK_RESET_MARKER_KEY = 'splenexa.learning-streak-reset.2026-11-07';
const DAILY_QUESTION_STORAGE_KEY_PREFIX = 'splenexa.daily-question.';
const DAILY_QUESTION_SELECTION_KEY_PREFIX = 'splenexa.daily-question-selection.';

const TEST_CATEGORIES = {
  grandTest: 'Grand Test',
  imageBasedTest: 'Image Based Test',
  subjectWiseTest: 'Subject-wise Test',
  qBank: 'Q-Bank',
};

function getBookmarkStorageId(identity) {
  let firstHash = 0x811c9dc5;
  let secondHash = 0x9e3779b9;

  for (let index = 0; index < identity.length; index += 1) {
    const code = identity.charCodeAt(index);
    firstHash = Math.imul(firstHash ^ code, 0x01000193);
    secondHash = Math.imul(secondHash ^ code, 0x85ebca6b);
  }

  return `q.${(firstHash >>> 0).toString(36)}.${(secondHash >>> 0).toString(36)}`;
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentWeekStreakDays(activityDates, today = new Date()) {
  const completedDates = new Set(activityDates);
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return labels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { label, completed: completedDates.has(getLocalDateKey(date)) };
  });
}

function getCurrentStreakLength(activityDates, today = new Date()) {
  const completedDates = new Set(activityDates);
  const currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);
  if (!completedDates.has(getLocalDateKey(currentDate))) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  let streakLength = 0;
  while (streakLength < 7 && completedDates.has(getLocalDateKey(currentDate))) {
    streakLength += 1;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return streakLength;
}

export default function MainTabs({
  userName,
  phoneNumber,
  userState,
  batchYear,
  onNotificationPress,
  onSignOut,
}) {
  const [activeScreen, setActiveScreen] = useState('home');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewReturnScreen, setPreviewReturnScreen] = useState('home');
  const [libraryReturnScreen, setLibraryReturnScreen] = useState('home');
  const [notificationReturnScreen, setNotificationReturnScreen] = useState('home');
  const [videoTopicReturnScreen, setVideoTopicReturnScreen] = useState('videos');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionReturnScreen, setQuestionReturnScreen] = useState('testSeries');
  const [testLocks, setTestLocks] = useState({});
  const [testLocksLoaded, setTestLocksLoaded] = useState(false);
  const [testLocksLoadError, setTestLocksLoadError] = useState(null);
  const [attemptHistory, setAttemptHistory] = useState([]);
  const [attemptHistoryLoaded, setAttemptHistoryLoaded] = useState(false);
  const [attemptHistoryLoadError, setAttemptHistoryLoadError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [activityDates, setActivityDates] = useState([]);
  const [streakLoaded, setStreakLoaded] = useState(false);
  const [streakLoadError, setStreakLoadError] = useState(null);
  const [dailyQuestion, setDailyQuestion] = useState(
    () => QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)],
  );
  const [dailyQuestionReady, setDailyQuestionReady] = useState(false);
  const [dailyQuestionAnswer, setDailyQuestionAnswer] = useState(null);
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);
  const [bookmarksLoadError, setBookmarksLoadError] = useState(null);
  const [questionProgress, setQuestionProgress] = useState({ attempted: 0, total: 0 });
  const [appAlert, setAppAlert] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [resultTestTitle, setResultTestTitle] = useState('Grand Test 4');
  const [resultSubjectName, setResultSubjectName] = useState('Anatomy');
  const [videoSubjectTitle, setVideoSubjectTitle] = useState('Anatomy');
  const attemptHistoryRef = useRef([]);
  const historySaveQueueRef = useRef(Promise.resolve());
  const bookmarksRef = useRef([]);
  const bookmarkSaveQueueRef = useRef(Promise.resolve());
  const activityDatesRef = useRef([]);
  const streakSaveQueueRef = useRef(Promise.resolve());
  const streakLoadPromiseRef = useRef(null);
  const streakLoadFailedRef = useRef(false);
  const attemptLocksMigratedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const dateKey = getLocalDateKey(new Date());
    const selectionKey = `${DAILY_QUESTION_SELECTION_KEY_PREFIX}${dateKey}`;

    SecureStore.getItemAsync(selectionKey)
      .then(async (savedQuestionId) => {
        const selectedQuestion = QUESTION_BANK.find(
          (question) => String(question.id) === savedQuestionId,
        );
        if (savedQuestionId && !selectedQuestion) {
          throw new Error('Stored daily question is not in the question bank.');
        }

        if (selectedQuestion) {
          if (isMounted) {
            setDailyQuestion(selectedQuestion);
            setDailyQuestionReady(true);
          }
          return;
        }

        const randomQuestion =
          QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
        await SecureStore.setItemAsync(selectionKey, String(randomQuestion.id));
        if (isMounted) {
          setDailyQuestion(randomQuestion);
          setDailyQuestionReady(true);
        }
      })
      .catch((error) => {
        console.error('Unable to load daily question selection.', error);
        if (isMounted) {
          setAppAlert({
            title: 'Unable to load today’s question',
            message: 'The question of the day could not be saved. Please try again.',
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const answerKey =
      `${DAILY_QUESTION_STORAGE_KEY_PREFIX}${getLocalDateKey(new Date())}.` +
      String(dailyQuestion.id);

    setDailyQuestionAnswer(null);
    SecureStore.getItemAsync(answerKey)
      .then((savedAnswer) => {
        const parsedAnswer = savedAnswer === null ? null : Number(savedAnswer);
        if (
          parsedAnswer !== null &&
          (!Number.isInteger(parsedAnswer) ||
            parsedAnswer < 0 ||
            parsedAnswer >= dailyQuestion.options.length)
        ) {
          throw new Error('Saved daily question answer is invalid.');
        }
        if (isMounted) {
          setDailyQuestionAnswer(parsedAnswer);
        }
      })
      .catch((error) => {
        console.error('Unable to load daily question answer.', error);
      });

    return () => {
      isMounted = false;
    };
  }, [dailyQuestion]);

  useEffect(() => {
    let isMounted = true;

    const loadPromise = Promise.all([
      SecureStore.getItemAsync(LEARNING_STREAK_STORAGE_KEY),
      SecureStore.getItemAsync(STREAK_RESET_MARKER_KEY),
    ])
      .then(async ([storedActivityDates, resetApplied]) => {
        const parsedDates = storedActivityDates ? JSON.parse(storedActivityDates) : [];
        if (
          !Array.isArray(parsedDates) ||
          parsedDates.some(
            (date) => typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date),
          )
        ) {
          throw new Error('Stored learning streak data is invalid.');
        }
        let currentActivityDates = parsedDates;
        if (resetApplied !== '1') {
          currentActivityDates = parsedDates.filter((date) => date !== STREAK_RESET_DATE);
          await SecureStore.setItemAsync(
            LEARNING_STREAK_STORAGE_KEY,
            JSON.stringify(currentActivityDates),
          );
          await SecureStore.setItemAsync(STREAK_RESET_MARKER_KEY, '1');
        }
        if (isMounted) {
          activityDatesRef.current = currentActivityDates;
          setActivityDates(currentActivityDates);
          setStreakLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Unable to load learning streak.', error);
        streakLoadFailedRef.current = true;
        if (isMounted) {
          setStreakLoadError(error);
          setStreakLoaded(true);
        }
      });
    streakLoadPromiseRef.current = loadPromise;

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    SecureStore.getItemAsync(TEST_LOCKS_STORAGE_KEY)
      .then((storedLocks) => {
        if (!isMounted) {
          return;
        }

        const parsedLocks = storedLocks ? JSON.parse(storedLocks) : {};
        if (!parsedLocks || typeof parsedLocks !== 'object' || Array.isArray(parsedLocks)) {
          throw new Error('Stored test lock data is invalid.');
        }
        setTestLocks(parsedLocks);
        setTestLocksLoaded(true);
      })
      .catch((error) => {
        console.error('Unable to load test lock status.', error);
        if (isMounted) {
          setTestLocksLoadError(error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    SecureStore.getItemAsync(BOOKMARKS_INDEX_STORAGE_KEY)
      .then(async (storedIndex) => {
        const bookmarkKeys = storedIndex ? JSON.parse(storedIndex) : [];
        if (
          !Array.isArray(bookmarkKeys) ||
          bookmarkKeys.some((key) => typeof key !== 'string')
        ) {
          throw new Error('Stored bookmark index is invalid.');
        }

        const storedBookmarks = await Promise.all(
          bookmarkKeys.map(async (key) => {
            const storedBookmark = await SecureStore.getItemAsync(
              `${BOOKMARK_STORAGE_KEY_PREFIX}${key}`,
            );
            if (!storedBookmark) {
              throw new Error(`Saved question bookmark is missing: ${key}`);
            }
            const bookmark = JSON.parse(storedBookmark);
            if (
              !bookmark ||
              bookmark.key !== key ||
              typeof bookmark.identity !== 'string' ||
              typeof bookmark.text !== 'string'
            ) {
              throw new Error(`Saved question bookmark is invalid: ${key}`);
            }
            const titleSubject = bookmark.testTitle?.includes(' · ')
              ? bookmark.testTitle.split(' · ')[0]
              : undefined;
            return {
              ...bookmark,
              subjectName:
                bookmark.subjectName ??
                titleSubject ??
                (bookmark.category === 'Grand Test' ||
                bookmark.category === 'Image Based Test'
                  ? 'All Subjects'
                  : 'General'),
              explanation: bookmark.explanation ?? '',
            };
          }),
        );

        if (isMounted) {
          bookmarksRef.current = storedBookmarks;
          setBookmarks(storedBookmarks);
          setBookmarksLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Unable to load saved question bookmarks.', error);
        if (isMounted) {
          setBookmarksLoadError(error);
          setBookmarksLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    SecureStore.getItemAsync(TEST_HISTORY_STORAGE_KEY)
      .then((storedHistory) => {
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
        if (!Array.isArray(parsedHistory)) {
          throw new Error('Stored test history is invalid.');
        }
        if (isMounted) {
          attemptHistoryRef.current = parsedHistory;
          setAttemptHistory(parsedHistory);
          setAttemptHistoryLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Unable to load test attempt history.', error);
        if (isMounted) {
          setAttemptHistoryLoadError(error);
          setAttemptHistoryLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      !testLocksLoaded ||
      !attemptHistoryLoaded ||
      attemptHistoryLoadError ||
      attemptLocksMigratedRef.current
    ) {
      return;
    }

    attemptLocksMigratedRef.current = true;
    const previousAttempts = Object.entries(testLocks)
      .filter(([, status]) => status === 'submitted' || status === 'canceled')
      .filter(([key]) => !attemptHistoryRef.current.some((attempt) => attempt.key === key))
      .map(([key, status]) => {
        const separatorIndex = key.indexOf(':');
        const screen = key.slice(0, separatorIndex);
        return {
          key,
          title: key.slice(separatorIndex + 1),
          category: TEST_CATEGORIES[screen] ?? 'Test Series',
          status: status === 'submitted' ? 'completed' : 'canceled',
          attempted: 0,
          total: 0,
          startedAt: null,
          updatedAt: null,
        };
      });

    previousAttempts.reduce(
      (pending, attempt) => pending.then(() => saveAttemptHistory(attempt)),
      Promise.resolve(),
    ).catch((error) => {
      showAppAlert(
        'Unable to load previous attempts',
        'Some earlier test activity could not be added to your attempt history.',
      );
      console.error('Unable to migrate previous test attempts.', error);
    });
  }, [attemptHistoryLoadError, attemptHistoryLoaded, testLocks, testLocksLoaded]);

  const saveTestLock = async (key, status) => {
    const updatedLocks = { ...testLocks, [key]: status };
    await SecureStore.setItemAsync(TEST_LOCKS_STORAGE_KEY, JSON.stringify(updatedLocks));
    setTestLocks(updatedLocks);
  };

  const saveAttemptHistory = (entry) => {
    const save = historySaveQueueRef.current.then(async () => {
      const nextHistory = [
        entry,
        ...attemptHistoryRef.current.filter((item) => item.key !== entry.key),
      ].sort(
        (first, second) =>
          (Date.parse(second.updatedAt ?? '') || 0) -
          (Date.parse(first.updatedAt ?? '') || 0),
      );
      await SecureStore.setItemAsync(TEST_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
      attemptHistoryRef.current = nextHistory;
      setAttemptHistory(nextHistory);
    });
    historySaveQueueRef.current = save.catch((error) => {
      console.error('Unable to save test attempt history.', error);
    });
    return save;
  };

  const persistBookmarkChange = (bookmark, shouldSave) => {
    if (!bookmarksLoaded || bookmarksLoadError) {
      showAppAlert(
        'Bookmarks unavailable',
        'The app could not load your saved questions. Please restart the app and try again.',
      );
      return;
    }

    const key = getBookmarkStorageId(bookmark.identity);
    const bookmarkStorageKey = `${BOOKMARK_STORAGE_KEY_PREFIX}${key}`;
    const save = bookmarkSaveQueueRef.current.then(async () => {
      const currentBookmarks = bookmarksRef.current;
      const existingBookmark = currentBookmarks.find((item) => item.key === key);
      if (existingBookmark && existingBookmark.identity !== bookmark.identity) {
        throw new Error('Bookmark storage identifier collision.');
      }
      const nextBookmarks = shouldSave
        ? [{ ...bookmark, key, savedAt: new Date().toISOString() },
          ...currentBookmarks.filter((item) => item.key !== key)]
        : currentBookmarks.filter((item) => item.key !== key);
      const nextKeys = nextBookmarks.map((bookmark) => bookmark.key);

      if (shouldSave) {
        await SecureStore.setItemAsync(bookmarkStorageKey, JSON.stringify(nextBookmarks[0]));
        try {
          await SecureStore.setItemAsync(BOOKMARKS_INDEX_STORAGE_KEY, JSON.stringify(nextKeys));
        } catch (error) {
          try {
            await SecureStore.deleteItemAsync(bookmarkStorageKey);
          } catch (cleanupError) {
            console.error('Unable to clean up an unsaved bookmark.', cleanupError);
          }
          throw error;
        }
      } else {
        await SecureStore.setItemAsync(BOOKMARKS_INDEX_STORAGE_KEY, JSON.stringify(nextKeys));
        try {
          await SecureStore.deleteItemAsync(bookmarkStorageKey);
        } catch (error) {
          try {
            await SecureStore.setItemAsync(
              BOOKMARKS_INDEX_STORAGE_KEY,
              JSON.stringify(currentBookmarks.map((item) => item.key)),
            );
          } catch (rollbackError) {
            console.error('Unable to restore bookmark index after removal failure.', rollbackError);
          }
          throw error;
        }
      }

      bookmarksRef.current = nextBookmarks;
      setBookmarks(nextBookmarks);
    });

    bookmarkSaveQueueRef.current = save.catch((error) => {
      console.error('Unable to save question bookmark.', error);
    });
    save.catch(() => {
      showAppAlert(
        'Unable to save bookmark',
        'The app could not update your saved questions. Please try again.',
      );
    });
  };

  const toggleQuestionBookmark = (question, isCurrentlyBookmarked) => {
      persistBookmarkChange(
        {
          identity: `${questionReturnScreen}:${questionTitle}:${question.id ?? question.text}`,
          testTitle: questionTitle,
          category: TEST_CATEGORIES[questionReturnScreen] ?? 'Test Series',
          subjectName:
            question.subjectName ??
            (questionTitle.includes(' · ')
              ? questionTitle.split(' · ')[0]
              : questionReturnScreen === 'grandTest'
                ? 'All Subjects'
                : 'General'),
          questionId: question.id,
          text: question.text,
          image: question.image,
          imageAspectRatio: question.imageAspectRatio,
          options: question.options,
          answer: question.answer,
          explanation: question.explanation ?? '',
          explanationImage: question.explanationImage,
          explanationImageAspectRatio: question.explanationImageAspectRatio,
          explanationTable: question.explanationTable,
        },
        !isCurrentlyBookmarked,
      );
  };

  const updateQuestionProgress = useCallback(({ attempted, total }) => {
    setQuestionProgress({ attempted, total });
    const key = `${questionReturnScreen}:${questionTitle}`;
    const existing = attemptHistoryRef.current.find((item) => item.key === key);
    if (!existing) {
      return;
    }

    saveAttemptHistory({
      ...existing,
      attempted,
      total,
      updatedAt: new Date().toISOString(),
    }).catch((error) => {
      showAppAlert('Unable to save progress', 'Your latest test progress could not be saved.');
      console.error('Unable to save test progress.', error);
    });
  }, [questionReturnScreen, questionTitle]);

  const showAppAlert = (title, message) => setAppAlert({ title, message });

  const recordLearningActivity = () => {
    const save = streakSaveQueueRef.current.then(async () => {
      if (streakLoadPromiseRef.current) {
        await streakLoadPromiseRef.current;
      } else if (!streakLoaded) {
        throw new Error('Learning streak is not available.');
      }
      if (streakLoadFailedRef.current || streakLoadError) {
        throw streakLoadError ?? new Error('Learning streak is not available.');
      }

      const today = getLocalDateKey(new Date());
      const oldestDate = new Date();
      oldestDate.setDate(oldestDate.getDate() - 59);
      const cutoff = getLocalDateKey(oldestDate);
      const nextDates = [...new Set([...activityDatesRef.current, today])]
        .filter((date) => date >= cutoff)
        .sort();
      await SecureStore.setItemAsync(
        LEARNING_STREAK_STORAGE_KEY,
        JSON.stringify(nextDates),
      );
      activityDatesRef.current = nextDates;
      setActivityDates(nextDates);
    });

    streakSaveQueueRef.current = save.catch((error) => {
      console.error('Unable to save learning streak activity.', error);
    });
    save.catch(() => {
      showAppAlert(
        'Unable to update streak',
        'Your learning activity could not be saved. Please try again.',
      );
    });
    return save;
  };

  const openDailyQuestion = async () => {
    if (!dailyQuestionReady) {
      showAppAlert(
        'Question unavailable',
        'Today’s question is still loading. Please try again in a moment.',
      );
      return;
    }

    const answerKey =
      `${DAILY_QUESTION_STORAGE_KEY_PREFIX}${getLocalDateKey(new Date())}.` +
      String(dailyQuestion.id);
    try {
      const savedAnswer = await SecureStore.getItemAsync(answerKey);
      const parsedAnswer = savedAnswer === null ? null : Number(savedAnswer);
      if (
        parsedAnswer !== null &&
        (!Number.isInteger(parsedAnswer) ||
          parsedAnswer < 0 ||
          parsedAnswer >= dailyQuestion.options.length)
      ) {
        throw new Error('Saved daily question answer is invalid.');
      }
      setDailyQuestionAnswer(parsedAnswer);
      setActiveScreen('dailyQuestion');
    } catch (error) {
      console.error('Unable to load daily question answer.', error);
      showAppAlert(
        'Unable to load today’s question',
        'The saved answer could not be loaded. Please try again.',
      );
    }
  };

  const saveDailyQuestionAnswer = (answer) => {
    setDailyQuestionAnswer(answer);
    const answerKey =
      `${DAILY_QUESTION_STORAGE_KEY_PREFIX}${getLocalDateKey(new Date())}.` +
      String(dailyQuestion.id);
    SecureStore.setItemAsync(answerKey, String(answer))
      .catch((error) => {
        console.error('Unable to save daily question answer.', error);
        showAppAlert(
          'Unable to save answer',
          'Your answer was shown, but could not be saved for later.',
        );
      });
    recordLearningActivity();
  };

  const withAppAlert = (screen) => (
    <>
      {screen}
      <ThemedAlert
        visible={appAlert !== null}
        title={appAlert?.title}
        message={appAlert?.message}
        actions={[
          {
            label: 'OK',
            variant: 'primary',
            onPress: () => setAppAlert(null),
          },
        ]}
        onRequestClose={() => setAppAlert(null)}
      />
    </>
  );

  useEffect(() => {
    if (
      activeScreen !== 'grandTest' &&
      activeScreen !== 'imageBasedTest' &&
      activeScreen !== 'subjectWiseTest' &&
      activeScreen !== 'testSeriesTests' &&
      activeScreen !== 'qBank' &&
      activeScreen !== 'imageBank' &&
      activeScreen !== 'pdfLibrary' &&
      activeScreen !== 'videos' &&
      activeScreen !== 'notifications' &&
      activeScreen !== 'profile' &&
      activeScreen !== 'attempts' &&
      activeScreen !== 'bookmarks' &&
      activeScreen !== 'bookmarkDetail' &&
      activeScreen !== 'dailyQuestion' &&
      activeScreen !== 'preview' &&
      activeScreen !== 'question' &&
      activeScreen !== 'grandTestResult' &&
      activeScreen !== 'videoTopic' &&
      activeScreen !== 'imageBasedTestResult' &&
      activeScreen !== 'subjectWiseTestResult'
    ) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (activeScreen === 'question') {
        return false;
      }
      setActiveScreen(
        activeScreen === 'testSeriesTests'
          ? 'testSeries'
          : activeScreen === 'imageBank' ||
          activeScreen === 'pdfLibrary' ||
          activeScreen === 'videos' ||
          activeScreen === 'qBank'
          ? libraryReturnScreen
          : activeScreen === 'notifications'
            ? notificationReturnScreen
            : activeScreen === 'profile'
              ? 'home'
              : activeScreen === 'attempts'
                ? 'profile'
                : activeScreen === 'bookmarks'
                  ? 'profile'
                : activeScreen === 'bookmarkDetail'
                  ? 'bookmarks'
                : activeScreen === 'dailyQuestion'
                  ? 'home'
                : activeScreen === 'videoTopic'
                  ? videoTopicReturnScreen
                  : activeScreen === 'preview'
                    ? previewReturnScreen
                    : activeScreen === 'question'
                      ? questionReturnScreen
                      : activeScreen === 'grandTestResult'
                        ? 'grandTest'
                        : activeScreen === 'imageBasedTestResult'
                          ? 'imageBasedTest'
                          : activeScreen === 'subjectWiseTestResult'
                            ? 'subjectWiseTest'
                            : 'testSeries',
      );
      return true;
    });
    return () => subscription.remove();
  }, [
    activeScreen,
    libraryReturnScreen,
    notificationReturnScreen,
    previewReturnScreen,
    questionReturnScreen,
    videoTopicReturnScreen,
  ]);

  const openPreview = (item, fallbackTitle, returnScreen = activeScreen) => {
    setPreviewTitle(
      typeof item === 'string'
        ? item
        : item?.name || item?.title || fallbackTitle,
    );
    setPreviewReturnScreen(returnScreen);
    setActiveScreen('preview');
  };

  const openQuestion = async (title, returnScreen) => {
    const isTest = [
      'grandTest',
      'imageBasedTest',
      'subjectWiseTest',
    ].includes(returnScreen);
    if (isTest && (testLocksLoadError || !testLocksLoaded)) {
      showAppAlert(
        'Test status unavailable',
        'The app could not verify whether this test has already been completed. Please restart the app and try again.',
      );
      return;
    }

    const testKey = `${returnScreen}:${title}`;
    if (isTest && testLocks[testKey]) {
      showAppAlert(
        testLocks[testKey] === 'submitted' ? 'Test already submitted' : 'Test canceled',
        'This test cannot be attempted again.',
      );
      return;
    }

    if (!attemptHistoryLoaded || attemptHistoryLoadError) {
      showAppAlert(
        'Attempt history unavailable',
        'The app could not load your saved test activity. Please restart the app and try again.',
      );
      return;
    }

    const now = new Date().toISOString();
    try {
      await saveAttemptHistory({
        key: testKey,
        title,
        category: TEST_CATEGORIES[returnScreen] ?? 'Test Series',
        status: 'in_progress',
        attempted: 0,
        total: 0,
        startedAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.error('Unable to start test attempt history.', error);
      showAppAlert('Unable to save attempt', 'The app could not save this test to your attempt history.');
      return;
    }

    setQuestionTitle(title);
    setQuestionReturnScreen(returnScreen);
    setQuestionProgress({ attempted: 0, total: 0 });
    recordLearningActivity();
    setActiveScreen('question');
  };

  const openLibrary = (screen, returnScreen = activeScreen) => {
    setLibraryReturnScreen(returnScreen);
    setActiveScreen(screen);
  };

  const openNotifications = (returnScreen = activeScreen) => {
    setNotificationReturnScreen(returnScreen);
    setActiveScreen('notifications');
  };

  const openNotification = (notificationId) => {
    switch (notificationId) {
      case 'anatomy-video':
        setVideoSubjectTitle('Anatomy');
        setVideoTopicReturnScreen('notifications');
        setActiveScreen('videoTopic');
        break;
      case 'anatomy-pdf':
        openPreview('Anatomy', 'PDF Library', 'notifications');
        break;
      case 'anatomy-image':
        openPreview('Anatomy', 'Image Bank', 'notifications');
        break;
      case 'grand-test-4':
        openQuestion('Grand Test 4', 'grandTest');
        break;
      case 'subject-wise-test':
        setResultSubjectName('Anatomy');
        openQuestion('Anatomy · Subject-wise Test', 'subjectWiseTest');
        break;
      case 'qbank-anatomy':
        setLibraryReturnScreen('notifications');
        openQuestion('Anatomy · Q Bank', 'qBank');
        break;
      case 'image-based-test-4':
        openQuestion('IBT 4', 'imageBasedTest');
        break;
      default:
        break;
    }
  };

  const finishTest = async (evaluatedResult) => {
    const testKey = `${questionReturnScreen}:${questionTitle}`;
    const existing = attemptHistoryRef.current.find((item) => item.key === testKey);
    const completedAttempt = {
      ...existing,
      key: testKey,
      title: questionTitle,
      category: TEST_CATEGORIES[questionReturnScreen] ?? 'Test Series',
      status: 'completed',
      attempted: evaluatedResult.total - evaluatedResult.unanswered,
      total: evaluatedResult.total,
      score: evaluatedResult.score,
      accuracy: evaluatedResult.accuracy,
      percentage: evaluatedResult.percentage,
      timeSpent: evaluatedResult.timeSpent,
      startedAt: existing?.startedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    let historySaved = false;
    try {
      await saveAttemptHistory(completedAttempt);
      historySaved = true;
      await saveTestLock(testKey, 'submitted');
    } catch (error) {
      if (historySaved) {
        try {
          await saveAttemptHistory({
            ...completedAttempt,
            status: 'in_progress',
            updatedAt: new Date().toISOString(),
          });
        } catch (historyError) {
          console.error('Unable to restore in-progress attempt history.', historyError);
        }
      }
      console.error('Unable to save submitted test status.', error);
      showAppAlert(
        'Unable to submit test',
        'The app could not save this test as completed. Please try submitting again.',
      );
      return;
    }

    setResultTestTitle(questionTitle);
    setResultData(evaluatedResult);
    if (questionReturnScreen === 'subjectWiseTest') {
      setActiveScreen('subjectWiseTestResult');
      return;
    }
    setActiveScreen(
      questionReturnScreen === 'imageBasedTest' ? 'imageBasedTestResult' : 'grandTestResult',
    );
  };

  const cancelTest = async () => {
    const testKey = `${questionReturnScreen}:${questionTitle}`;
    const existing = attemptHistoryRef.current.find((item) => item.key === testKey);
    const canceledAttempt = {
      ...existing,
      key: testKey,
      title: questionTitle,
      category: TEST_CATEGORIES[questionReturnScreen] ?? 'Test Series',
      status: 'canceled',
      attempted: questionProgress.attempted,
      total: questionProgress.total,
      startedAt: existing?.startedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    let historySaved = false;
    try {
      await saveAttemptHistory(canceledAttempt);
      historySaved = true;
      await saveTestLock(testKey, 'canceled');
    } catch (error) {
      if (historySaved) {
        try {
          await saveAttemptHistory({
            ...canceledAttempt,
            status: 'in_progress',
            updatedAt: new Date().toISOString(),
          });
        } catch (historyError) {
          console.error('Unable to restore in-progress attempt history.', historyError);
        }
      }
      console.error('Unable to save canceled test status.', error);
      showAppAlert(
        'Unable to cancel test',
        'The app could not save the cancellation. Please try again.',
      );
      return;
    }

    setNotificationReturnScreen(questionReturnScreen);
    setActiveScreen('notifications');
  };

  const onNavigate = (tab) => {
    if (tab === 'home') {
      setActiveScreen('home');
    } else if (tab === 'testSeries') {
      setActiveScreen('testSeries');
    } else if (tab === 'videos') {
      openLibrary('videos');
    } else if (tab === 'profile') {
      setActiveScreen(tab);
    } else if (tab === 'notifications') {
      openNotifications();
    }
  };

  if (activeScreen === 'preview') {
    return withAppAlert(
      <PreviewDetailScreen
        title={previewTitle}
        onBack={() => setActiveScreen(previewReturnScreen)}
      />,
    );
  }

  if (activeScreen === 'dailyQuestion') {
    return withAppAlert(
      <DailyQuestionScreen
        question={dailyQuestion}
        initialAnswer={dailyQuestionAnswer}
        onAnswer={saveDailyQuestionAnswer}
        onBack={() => setActiveScreen('home')}
      />,
    );
  }

  if (activeScreen === 'question') {
    return withAppAlert(
      <QuestionScreen
        title={questionTitle}
        onBack={() => setActiveScreen(questionReturnScreen)}
        onCancel={cancelTest}
        onProgressChange={updateQuestionProgress}
        bookmarkedKeys={bookmarks.map((bookmark) => bookmark.identity)}
        bookmarkKeyPrefix={`${questionReturnScreen}:${questionTitle}:`}
        onToggleBookmark={toggleQuestionBookmark}
        onFinish={
          questionReturnScreen === 'grandTest' ||
          questionReturnScreen === 'imageBasedTest' ||
          questionReturnScreen === 'subjectWiseTest'
            ? finishTest
            : undefined
        }
      />,
    );
  }

  if (activeScreen === 'grandTestResult') {
    return (
      <GrandTestResultScreen
        result={resultData ?? undefined}
        testTitle={resultTestTitle}
        userName={userName}
        onBack={() => setActiveScreen('grandTest')}
        onReviewQuestions={() => setActiveScreen('question')}
      />
    );
  }

  if (activeScreen === 'imageBasedTestResult') {
    return (
      <ImageBasedTestResultScreen
        result={resultData ?? undefined}
        testTitle={resultTestTitle}
        userName={userName}
        onBack={() => setActiveScreen('imageBasedTest')}
        onReviewQuestions={() => setActiveScreen('question')}
      />
    );
  }

  if (activeScreen === 'subjectWiseTestResult') {
    return (
      <GrandTestResultScreen
        result={resultData ?? undefined}
        variant="subjectWise"
        topicName={resultSubjectName}
        testTitle={resultTestTitle}
        userName={userName}
        onBack={() => setActiveScreen('subjectWiseTest')}
        onReviewQuestions={() => setActiveScreen('question')}
      />
    );
  }

  if (activeScreen === 'grandTest') {
    return withAppAlert(
      <GrandTestScreen
        onBack={() => setActiveScreen('testSeries')}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenTest={(test) => openQuestion(`Grand Test ${test.id}`, 'grandTest')}
      />,
    );
  }

  if (activeScreen === 'imageBasedTest') {
    return withAppAlert(
      <ImageBasedTestScreen
        onBack={() => setActiveScreen('testSeries')}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenTest={(test) => openQuestion(`IBT ${test.id}`, 'imageBasedTest')}
      />,
    );
  }

  if (activeScreen === 'subjectWiseTest') {
    return withAppAlert(
      <SubjectWiseTestScreen
        onBack={() => setActiveScreen('testSeries')}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenSubject={(subject) => {
          setResultSubjectName(subject.name);
          openQuestion(`${subject.name} · Subject-wise Test`, 'subjectWiseTest');
        }}
      />,
    );
  }

  if (activeScreen === 'qBank') {
    return (
      <QBankScreen
        onBack={() => setActiveScreen(libraryReturnScreen)}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenSubject={(subject) => openQuestion(`${subject.name} · Q Bank`, 'qBank')}
      />
    );
  }

  if (activeScreen === 'imageBank') {
    return withAppAlert(
      <ImageBankScreen
        onBack={() => setActiveScreen(libraryReturnScreen)}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenSubject={(subject) => {
          recordLearningActivity();
          openPreview(subject, 'Image Bank', 'imageBank');
        }}
      />,
    );
  }

  if (activeScreen === 'pdfLibrary') {
    return withAppAlert(
      <PdfScreen
        onBack={() => setActiveScreen(libraryReturnScreen)}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenSubject={(subject) => {
          recordLearningActivity();
          openPreview(subject, 'PDF Library', 'pdfLibrary');
        }}
      />,
    );
  }

  if (activeScreen === 'videos') {
    return withAppAlert(
      <VideoLibraryScreen
        onBack={() => setActiveScreen(libraryReturnScreen)}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenSubject={(subject) => {
          setVideoSubjectTitle(subject.name);
          setActiveScreen('videoTopic');
        }}
      />,
    );
  }

  if (activeScreen === 'videoTopic') {
    return withAppAlert(
      <AnatomyVideoCardScreen
        title={videoSubjectTitle}
        onBack={() => setActiveScreen(videoTopicReturnScreen)}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onPlay={(video) => {
          recordLearningActivity();
          openPreview(video, `${videoSubjectTitle} Videos`, 'videoTopic');
        }}
      />,
    );
  }

  if (activeScreen === 'notifications') {
    return withAppAlert(
      <NotificationsScreen
        onBack={() => setActiveScreen(notificationReturnScreen)}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenNotification={openNotification}
      />,
    );
  }

  if (activeScreen === 'profile') {
    return (
      <ProfileScreen
        userName={userName}
        phoneNumber={phoneNumber}
        stateName={userState}
        batchYear={batchYear}
        onNavigate={onNavigate}
        onNotificationPress={() => openNotifications('profile')}
        onOpenAttempts={() => setActiveScreen('attempts')}
        onOpenPerformance={() => openPreview('Performance', 'Performance', 'profile')}
        onOpenAnnotatedFiles={() => openPreview('Annotated Files', 'Annotated Files', 'profile')}
        onOpenBookmarks={() => setActiveScreen('bookmarks')}
        onSignOut={onSignOut}
      />
    );
  }

  if (activeScreen === 'attempts') {
    return (
      <MyAttemptsScreen
        attempts={attemptHistory}
        loadError={attemptHistoryLoadError}
        onBack={() => setActiveScreen('profile')}
        onNavigate={onNavigate}
        onNotificationPress={() => openNotifications('attempts')}
      />
    );
  }

  if (activeScreen === 'bookmarks') {
    return withAppAlert(
      <BookmarksScreen
        bookmarks={bookmarks}
        loadError={bookmarksLoadError}
        onOpen={(key) => {
          const bookmark = bookmarksRef.current.find((item) => item.key === key);
          if (bookmark) {
            setSelectedBookmark(bookmark);
            setActiveScreen('bookmarkDetail');
          }
        }}
        onRemove={(key) => {
          const bookmark = bookmarksRef.current.find((item) => item.key === key);
          if (bookmark) {
            persistBookmarkChange(bookmark, false);
          }
        }}
        onBack={() => setActiveScreen('profile')}
        onNavigate={onNavigate}
        onNotificationPress={() => openNotifications('bookmarks')}
      />,
    );
  }

  if (activeScreen === 'bookmarkDetail' && selectedBookmark) {
    return (
      <BookmarkDetailScreen
        bookmark={selectedBookmark}
        onBack={() => setActiveScreen('bookmarks')}
      />
    );
  }

  if (activeScreen === 'testSeries') {
    return (
      <TestSeriesScreen
        activeTab="testSeries"
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenQBank={() => openLibrary('qBank', 'testSeries')}
        onOpenTestSeries={() => setActiveScreen('testSeriesTests')}
      />
    );
  }

  if (activeScreen === 'testSeriesTests') {
    return (
      <TestSeriesScreen
        activeTab="testSeries"
        view="tests"
        onBack={() => setActiveScreen('testSeries')}
        onNavigate={onNavigate}
        onNotificationPress={onNotificationPress}
        onOpenGrandTest={() => setActiveScreen('grandTest')}
        onOpenSubjectTest={() => setActiveScreen('subjectWiseTest')}
        onOpenImageTest={() => setActiveScreen('imageBasedTest')}
      />
    );
  }

  return withAppAlert(
    <HomeScreen
      userName={userName}
      streakDays={getCurrentWeekStreakDays(activityDates)}
      streakCount={getCurrentStreakLength(activityDates)}
      streakCompleted={activityDates.includes(getLocalDateKey(new Date()))}
      streakError={streakLoadError}
      todayQuestion={dailyQuestion.text}
      todayQuestionSubject={dailyQuestion.subjectName}
      activeTab="home"
      onNavigate={onNavigate}
      onNotificationPress={onNotificationPress}
      onAnswerQuestion={openDailyQuestion}
      onOpenPreviousVideo={() => {
        recordLearningActivity();
        openPreview('Previous Video', 'Previous Video', 'home');
      }}
      onOpenPdf={() => openLibrary('pdfLibrary', 'home')}
      onOpenImageBank={() => setActiveScreen('imageBank')}
    />,
  );
}
