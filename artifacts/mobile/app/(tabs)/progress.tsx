import React from 'react';
import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { courses } from '@/data/courses';
import { getRecentActivity, useLearning } from '@/context/LearningContext';
import {
  PageHeader,
  ProgressBar,
  Screen,
  SectionHeading,
  Surface,
  TextButton,
} from '@/components/Shared';
import { useColors } from '@/hooks/useColors';

export default function ProgressScreen() {
  const colors = useColors();
  const { progress, currentStreak, isReady } = useLearning();
  const completed = new Set(progress.completedLessonIds);
  const completedCourses = courses.filter((course) =>
    course.lessons.every((lesson) => completed.has(lesson.id)),
  ).length;
  const totalLessons = courses.reduce((count, course) => count + course.lessons.length, 0);
  const activity = getRecentActivity(progress.activeDates);

  if (!isReady) return null;

  const milestones = [
    {
      title: 'First step',
      detail: 'Complete your first coding lesson',
      earned: progress.completedLessonIds.length > 0,
      icon: 'flag' as const,
    },
    {
      title: 'Keep the rhythm',
      detail: 'Build a 7-day learning streak',
      earned: progress.bestStreak >= 7,
      icon: 'zap' as const,
    },
    {
      title: 'Path finisher',
      detail: 'Earn a course certificate',
      earned: completedCourses > 0,
      icon: 'award' as const,
    },
  ];

  return (
    <Screen>
      <PageHeader
        eyebrow="Every step counts"
        title="Your progress"
        subtitle="See how far you have come, one lesson at a time."
      />

      <View style={{ flexDirection: 'row', gap: 11 }}>
        {[
          { label: 'Lessons', value: String(progress.completedLessonIds.length), icon: 'book-open' as const },
          { label: 'Day streak', value: String(currentStreak), icon: 'zap' as const },
          { label: 'Certificates', value: String(completedCourses), icon: 'award' as const },
        ].map((stat) => (
          <Surface key={stat.label} style={{ flex: 1, padding: 13 }}>
            <Feather name={stat.icon} size={17} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontSize: 21, fontFamily: 'Inter_700Bold', marginTop: 12 }}>
              {stat.value}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 2 }}>
              {stat.label}
            </Text>
          </Surface>
        ))}
      </View>

      <SectionHeading title="Your week" />
      <Surface style={{ paddingVertical: 17, paddingHorizontal: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 24 }}>
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 }}>
              Best streak: {progress.bestStreak} {progress.bestStreak === 1 ? 'day' : 'days'}
            </Text>
          </View>
          <View style={{ width: 44, height: 44, backgroundColor: colors.warningSoft, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="zap" size={21} color={colors.warning} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          {activity.map((day) => (
            <View key={day.key} style={{ alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 30,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: day.active ? colors.successSoft : colors.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name={day.active ? 'check' : 'minus'} size={14} color={day.active ? colors.primary : colors.mutedForeground} />
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, fontFamily: 'Inter_500Medium' }}>
                {day.label}
              </Text>
            </View>
          ))}
        </View>
      </Surface>

      <SectionHeading title="Learning paths" />
      <View style={{ gap: 11 }}>
        {courses.map((course) => {
          const count = course.lessons.filter((lesson) => completed.has(lesson.id)).length;
          const percentage = Math.round((count / course.lessons.length) * 100);
          return (
            <Surface key={course.id} style={{ padding: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: colors.foreground, fontSize: 14, fontFamily: 'Inter_600SemiBold', flex: 1 }}>
                  {course.title}
                </Text>
                <Text style={{ color: colors.primary, fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>
                  {percentage}%
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <ProgressBar value={percentage} height={6} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: 'Inter_400Regular' }}>
                  {count} of {course.lessons.length} lessons
                </Text>
                <TextButton title={count === course.lessons.length ? 'View certificate' : 'Continue'} onPress={() => router.push(count === course.lessons.length ? `/certificate/${course.id}` : `/course/${course.id}`)} />
              </View>
            </Surface>
          );
        })}
      </View>

      <SectionHeading title="Milestones" />
      <Surface style={{ padding: 0, overflow: 'hidden' }}>
        {milestones.map((milestone, index) => (
          <View
            key={milestone.title}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              padding: 14,
              borderBottomWidth: index === milestones.length - 1 ? 0 : 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ width: 39, height: 39, borderRadius: 13, backgroundColor: milestone.earned ? colors.successSoft : colors.muted, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name={milestone.icon} size={18} color={milestone.earned ? colors.primary : colors.mutedForeground} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontFamily: 'Inter_600SemiBold' }}>
                {milestone.title}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 }}>
                {milestone.detail}
              </Text>
            </View>
            <Feather name={milestone.earned ? 'check-circle' : 'lock'} size={17} color={milestone.earned ? colors.primary : colors.mutedForeground} />
          </View>
        ))}
      </Surface>

      <View style={{ marginTop: 22, alignItems: 'center' }}>
        <TextButton title="Browse learning paths" onPress={() => router.push('/learn')} />
      </View>
    </Screen>
  );
}
