import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { courses, findLesson } from '@/data/courses';

const STORAGE_KEY = '@code-campus-ke/learning-progress-v1';

export type LearningProgress = {
  displayName: string;
  completedLessonIds: string[];
  activeDates: string[];
  certificateDates: Record<string, string>;
  lastLessonId: string | null;
  bestStreak: number;
};

const initialProgress: LearningProgress = {
  displayName: 'Learner',
  completedLessonIds: [],
  activeDates: [],
  certificateDates: {},
  lastLessonId: null,
  bestStreak: 0,
};

type LearningContextValue = {
  progress: LearningProgress;
  isReady: boolean;
  storageError: boolean;
  currentStreak: number;
  updateDisplayName: (name: string) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
};

const LearningContext = createContext<LearningContextValue | null>(null);

export function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function streakFromDates(activeDates: string[], now = new Date()) {
  const dates = new Set(activeDates);
  const today = localDateKey(now);
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (dates.has(localDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getRecentActivity(activeDates: string[], now = new Date()) {
  const dates = new Set(activeDates);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    day.setDate(day.getDate() - (6 - index));
    return {
      key: localDateKey(day),
      label: day.toLocaleDateString('en-KE', { weekday: 'short' }).slice(0, 2),
      active: dates.has(localDateKey(day)),
    };
  });
}

function isLearningProgress(value: unknown): value is LearningProgress {
  if (!value || typeof value !== 'object') return false;
  const record = value as Partial<LearningProgress>;
  return (
    typeof record.displayName === 'string' &&
    Array.isArray(record.completedLessonIds) &&
    Array.isArray(record.activeDates) &&
    !!record.certificateDates &&
    typeof record.certificateDates === 'object' &&
    (record.lastLessonId === null || typeof record.lastLessonId === 'string') &&
    typeof record.bestStreak === 'number'
  );
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<LearningProgress>(initialProgress);
  const [isReady, setIsReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!mounted) return;
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (!isLearningProgress(parsed)) {
            setStorageError(true);
          } else {
            setProgress(parsed);
          }
        }
      })
      .catch(() => {
        if (mounted) setStorageError(true);
      })
      .finally(() => {
        if (mounted) setIsReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const saveProgress = useCallback(async (next: LearningProgress) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, []);

  const updateDisplayName = useCallback(
    async (name: string) => {
      const cleanedName = name.trim().slice(0, 26) || 'Learner';
      await saveProgress({ ...progress, displayName: cleanedName });
    },
    [progress, saveProgress],
  );

  const completeLesson = useCallback(
    async (lessonId: string) => {
      const today = localDateKey(new Date());
      const completed = new Set([...progress.completedLessonIds, lessonId]);
      const activeDates = Array.from(new Set([...progress.activeDates, today]));
      const certificateDates = { ...progress.certificateDates };

      for (const course of courses) {
        const courseIsComplete = course.lessons.every((lesson) =>
          completed.has(lesson.id),
        );
        if (courseIsComplete && !certificateDates[course.id]) {
          certificateDates[course.id] = today;
        }
      }

      const currentStreak = streakFromDates(activeDates);
      await saveProgress({
        ...progress,
        completedLessonIds: Array.from(completed),
        activeDates,
        certificateDates,
        lastLessonId: findLesson(lessonId)?.lesson.id ?? progress.lastLessonId,
        bestStreak: Math.max(progress.bestStreak, currentStreak),
      });
    },
    [progress, saveProgress],
  );

  const currentStreak = useMemo(
    () => streakFromDates(progress.activeDates),
    [progress.activeDates],
  );

  const value = useMemo(
    () => ({
      progress,
      isReady,
      storageError,
      currentStreak,
      updateDisplayName,
      completeLesson,
    }),
    [
      progress,
      isReady,
      storageError,
      currentStreak,
      updateDisplayName,
      completeLesson,
    ],
  );

  return (
    <LearningContext.Provider value={value}>{children}</LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used inside LearningProvider');
  }
  return context;
}
