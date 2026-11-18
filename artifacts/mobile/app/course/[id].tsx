import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { findCourse } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import {
  IconAction,
  PageHeader,
  PrimaryButton,
  ProgressBar,
  Screen,
  Surface,
} from '@/components/Shared';
import { useColors } from '@/hooks/useColors';

export default function CourseDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, isReady } = useLearning();
  const course = findCourse(id);
  const completed = new Set(progress.completedLessonIds);

  if (!isReady) return null;
  if (!course) {
    return (
      <Screen>
        <PageHeader title="Learning path not found" subtitle="Choose a path from your course list." />
        <PrimaryButton title="Browse learning paths" onPress={() => router.replace('/learn')} icon="arrow-left" />
      </Screen>
    );
  }

  const completedCount = course.lessons.filter((lesson) => completed.has(lesson.id)).length;
  const nextIndex = course.lessons.findIndex((lesson) => !completed.has(lesson.id));
  const courseIsComplete = nextIndex === -1;
  const nextLesson = courseIsComplete ? course.lessons[0] : course.lessons[nextIndex];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <IconAction icon="arrow-left" label="Go back" onPress={() => router.back()} testID="back-from-course" />
        <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 1 }}>
          LEARNING PATH
        </Text>
        <View style={{ width: 33 }} />
      </View>

      <View style={{ backgroundColor: colors.primary, borderRadius: 25, padding: 20 }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primaryForeground, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name={course.icon} size={22} color={colors.primary} />
        </View>
        <Text style={{ color: colors.primaryForeground, fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 31, letterSpacing: -0.6, marginTop: 16 }}>
          {course.title}
        </Text>
        <Text style={{ color: colors.primaryForeground, opacity: 0.82, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, marginTop: 8 }}>
          {course.description}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 17, marginBottom: 16 }}>
          {[course.level, `${course.lessons.length} short lessons`].map((label) => (
            <View key={label} style={{ backgroundColor: colors.primaryForeground, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
              <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>
                {label}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: colors.primaryForeground, opacity: 0.8, fontFamily: 'Inter_500Medium', fontSize: 11 }}>
            Your progress
          </Text>
          <Text style={{ color: colors.primaryForeground, fontFamily: 'Inter_700Bold', fontSize: 11 }}>
            {completedCount}/{course.lessons.length}
          </Text>
        </View>
        <ProgressBar value={(completedCount / course.lessons.length) * 100} color={colors.accent} height={7} />
      </View>

      <View style={{ marginTop: 19, marginBottom: 7 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, letterSpacing: 1.1, fontFamily: 'Inter_700Bold' }}>
          WHAT YOU WILL BUILD
        </Text>
        <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 22, fontFamily: 'Inter_600SemiBold', marginTop: 6 }}>
          {course.outcome}
        </Text>
      </View>

      <Text style={{ color: colors.foreground, fontSize: 18, fontFamily: 'Inter_700Bold', marginTop: 22, marginBottom: 12 }}>
        Course outline
      </Text>
      <Surface style={{ padding: 0, overflow: 'hidden' }}>
        {course.lessons.map((lesson, index) => {
          const isComplete = completed.has(lesson.id);
          const isUnlocked = index <= completedCount;
          return (
            <Pressable
              key={lesson.id}
              testID={`lesson-row-${lesson.id}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: !isUnlocked }}
              disabled={!isUnlocked}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderBottomWidth: index === course.lessons.length - 1 ? 0 : 1,
                borderBottomColor: colors.border,
                opacity: pressed ? 0.74 : isUnlocked ? 1 : 0.58,
              })}
            >
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: isComplete ? colors.successSoft : colors.secondary, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name={isComplete ? 'check' : isUnlocked ? 'play' : 'lock'} size={16} color={isComplete ? colors.primary : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
                  {index + 1}. {lesson.title}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 }}>
                  {lesson.minutes} min · {isComplete ? 'Completed' : isUnlocked ? 'Ready to learn' : 'Complete the lesson above first'}
                </Text>
              </View>
              <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
            </Pressable>
          );
        })}
      </Surface>

      <View style={{ marginTop: 17 }}>
        {courseIsComplete ? (
          <PrimaryButton
            title="View your certificate"
            icon="award"
            testID="view-course-certificate"
            onPress={() => router.push(`/certificate/${course.id}`)}
          />
        ) : (
          <PrimaryButton
            title={completedCount === 0 ? 'Start this path' : 'Continue this path'}
            icon={completedCount === 0 ? 'play' : 'arrow-right'}
            testID="start-course"
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
          />
        )}
      </View>
    </Screen>
  );
}
