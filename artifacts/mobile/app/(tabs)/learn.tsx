import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { courses } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import { CourseTile } from '@/components/CourseTile';
import { PageHeader, Screen } from '@/components/Shared';
import { useColors } from '@/hooks/useColors';

const filters = ['All', 'Web', 'Frontend', 'Backend', 'Database'] as const;

export default function LearnScreen() {
  const colors = useColors();
  const { progress, isReady } = useLearning();
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('All');
  const completed = new Set(progress.completedLessonIds);
  const filteredCourses = useMemo(
    () =>
      selectedFilter === 'All'
        ? courses
        : courses.filter((course) => course.category === selectedFilter),
    [selectedFilter],
  );

  if (!isReady) return null;

  return (
    <Screen>
      <PageHeader
        eyebrow="The learning paths"
        title="Learn by building"
        subtitle="Start with the basics. Every short lesson moves you closer to a real project."
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
      >
        {filters.map((filter) => {
          const active = selectedFilter === filter;
          return (
            <Pressable
              key={filter}
              testID={`filter-${filter.toLowerCase()}`}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSelectedFilter(filter)}
              style={({ pressed }) => ({
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderRadius: 999,
                backgroundColor: active ? colors.primary : colors.card,
                borderWidth: active ? 0 : 1,
                borderColor: colors.border,
                opacity: pressed ? 0.78 : 1,
              })}
            >
              <Text
                style={{
                  color: active ? colors.primaryForeground : colors.mutedForeground,
                  fontSize: 12,
                  fontFamily: 'Inter_600SemiBold',
                }}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={{ marginTop: 19, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
          {filteredCourses.length} learning paths
        </Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12 }}>
          Made for beginners
        </Text>
      </View>
      <View style={{ gap: 12 }}>
        {filteredCourses.map((course) => (
          <CourseTile
            key={course.id}
            course={course}
            completedCount={course.lessons.filter((lesson) => completed.has(lesson.id)).length}
            onPress={() => router.push(`/course/${course.id}`)}
          />
        ))}
      </View>
      <View
        style={{
          backgroundColor: colors.secondary,
          padding: 16,
          borderRadius: 19,
          marginTop: 20,
        }}
      >
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>
          Your progress stays with you
        </Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 5 }}>
          Lessons and streaks save on this device, so you can learn at your own pace.
        </Text>
      </View>
    </Screen>
  );
}
