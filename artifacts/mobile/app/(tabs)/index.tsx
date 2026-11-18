import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { courses } from '@/data/courses';
import { useLearning, getRecentActivity } from '@/context/LearningContext';
import { useColors } from '@/hooks/useColors';
import {
  IconAction,
  PrimaryButton,
  ProgressBar,
  Screen,
  SectionHeading,
  Surface,
  TextButton,
} from '@/components/Shared';
import { CourseTile } from '@/components/CourseTile';

export default function HomeScreen() {
  const colors = useColors();
  const { progress, currentStreak, isReady, storageError } = useLearning();
  const completed = new Set(progress.completedLessonIds);
  const totalLessons = courses.reduce((count, course) => count + course.lessons.length, 0);
  const completedCount = progress.completedLessonIds.length;
  const lastCourse = courses.find((course) =>
    course.lessons.some((lesson) => lesson.id === progress.lastLessonId),
  );
  const nextCourse =
    (lastCourse &&
      lastCourse.lessons.some((lesson) => !completed.has(lesson.id)) &&
      lastCourse) ||
    courses.find((course) => course.lessons.some((lesson) => !completed.has(lesson.id)));
  const nextLesson = nextCourse?.lessons.find((lesson) => !completed.has(lesson.id));
  const recentActivity = getRecentActivity(progress.activeDates);
  const firstName = progress.displayName.split(' ')[0] || 'Learner';

  if (!isReady) return null;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <View>
          <Text style={{ color: colors.primary, fontSize: 11, letterSpacing: 1.5, fontFamily: 'Inter_700Bold' }}>
            CODE CAMPUS KE
          </Text>
          <Text style={{ color: colors.foreground, fontSize: 25, letterSpacing: -0.7, fontFamily: 'Inter_700Bold', marginTop: 5 }}>
            Habari, {firstName}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="zap" size={18} color={colors.warning} />
            <Text style={{ color: colors.foreground, fontSize: 14, fontFamily: 'Inter_700Bold' }}>
              {currentStreak}
            </Text>
          </View>
          <IconAction
            icon="user"
            label="Open your profile"
            testID="open-profile"
            onPress={() => router.push('/profile')}
          />
        </View>
      </View>

      {storageError ? (
        <View
          accessibilityRole="alert"
          style={{
            backgroundColor: colors.warningSoft,
            borderRadius: 14,
            padding: 12,
            marginBottom: 14,
          }}
        >
          <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' }}>
            Your saved progress could not be read. You can keep learning, but changes may not stay on this device.
          </Text>
        </View>
      ) : null}

      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 26,
          padding: 21,
          overflow: 'hidden',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={{ color: colors.primaryForeground, opacity: 0.76, fontSize: 10, letterSpacing: 1.4, fontFamily: 'Inter_700Bold' }}>
              YOUR NEXT STEP
            </Text>
            <Text style={{ color: colors.primaryForeground, fontSize: 23, lineHeight: 29, letterSpacing: -0.6, fontFamily: 'Inter_700Bold', marginTop: 8 }}>
              {nextLesson ? 'Build a little. Learn a lot.' : 'You finished every path.'}
            </Text>
            <Text style={{ color: colors.primaryForeground, opacity: 0.84, fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 8 }}>
              {nextLesson
                ? `${nextCourse?.title} · ${nextLesson.minutes} min lesson`
                : 'Your certificates are ready to view.'}
            </Text>
          </View>
          <View
            style={{
              width: 43,
              height: 43,
              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primaryForeground,
            }}
          >
            <Feather name={nextLesson ? 'code' : 'award'} size={21} color={colors.primary} />
          </View>
        </View>
        <View style={{ marginTop: 21, marginBottom: 13 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: colors.primaryForeground, opacity: 0.8, fontSize: 11, fontFamily: 'Inter_500Medium' }}>
              Learning journey
            </Text>
            <Text style={{ color: colors.primaryForeground, fontSize: 11, fontFamily: 'Inter_700Bold' }}>
              {completedCount} of {totalLessons}
            </Text>
          </View>
          <ProgressBar value={(completedCount / totalLessons) * 100} color={colors.accent} height={7} />
        </View>
        <PrimaryButton
          title={nextLesson ? 'Continue learning' : 'See certificates'}
          icon={nextLesson ? 'arrow-right' : 'award'}
          testID="continue-learning"
          onPress={() =>
            nextLesson && nextCourse
              ? router.push(`/lesson/${nextLesson.id}`)
              : router.push('/certificates')
          }
        />
      </View>

      <SectionHeading
        title="Your streak"
        action={
          <Text style={{ color: colors.primary, fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        }
      />
      <Surface style={{ paddingHorizontal: 15, paddingVertical: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {recentActivity.map((day, index) => (
            <View key={day.key} style={{ alignItems: 'center', gap: 8 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, fontFamily: 'Inter_500Medium' }}>
                {day.label}
              </Text>
              <View
                style={{
                  width: 31,
                  height: 31,
                  borderRadius: 11,
                  backgroundColor: day.active ? colors.success : colors.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather
                  name={day.active ? 'check' : index === 6 ? 'circle' : 'minus'}
                  size={14}
                  color={day.active ? colors.primaryForeground : colors.mutedForeground}
                />
              </View>
            </View>
          ))}
        </View>
        <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 14 }}>
          Finish a lesson today to keep your learning streak growing.
        </Text>
      </Surface>

      <SectionHeading
        title="Pick up a new skill"
        action={
          <TextButton
            title="See all"
            testID="see-all-courses"
            onPress={() => router.push('/learn')}
          />
        }
      />
      <View style={{ gap: 11 }}>
        {courses.slice(0, 2).map((course) => (
          <CourseTile
            key={course.id}
            course={course}
            completedCount={course.lessons.filter((lesson) => completed.has(lesson.id)).length}
            onPress={() => router.push(`/course/${course.id}`)}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        testID="open-progress"
        onPress={() => router.push('/progress')}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 21,
          padding: 15,
          borderRadius: 18,
          backgroundColor: colors.secondary,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
          <Feather name="trending-up" size={19} color={colors.primary} />
          <View>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
              Your learning progress
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 }}>
              {completedCount} lessons completed so far
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={19} color={colors.primary} />
      </Pressable>
    </Screen>
  );
}
