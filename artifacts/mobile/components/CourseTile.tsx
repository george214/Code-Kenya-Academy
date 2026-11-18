import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Course } from '@/data/courses';
import { useColors } from '@/hooks/useColors';
import { ProgressBar } from '@/components/Shared';

export function CourseTile({
  course,
  completedCount,
  onPress,
}: {
  course: Course;
  completedCount: number;
  onPress: () => void;
}) {
  const colors = useColors();
  const percent = Math.round((completedCount / course.lessons.length) * 100);
  return (
    <Pressable
      accessibilityRole="button"
      testID={`course-${course.id}`}
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 22,
          padding: 16,
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 13 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.secondary,
          }}
        >
          <Feather name={course.icon} size={21} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <Text
              style={{
                color: colors.foreground,
                fontFamily: 'Inter_700Bold',
                fontSize: 16,
                flexShrink: 1,
              }}
            >
              {course.title}
            </Text>
            <Feather name="arrow-up-right" size={17} color={colors.mutedForeground} />
          </View>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: 'Inter_400Regular',
              fontSize: 13,
              lineHeight: 19,
              marginTop: 4,
            }}
          >
            {course.description}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 15,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: 'Inter_500Medium' }}>
              {course.level} · {course.lessons.length} lessons
            </Text>
            <Text style={{ color: colors.primary, fontSize: 11, fontFamily: 'Inter_600SemiBold' }}>
              {completedCount}/{course.lessons.length}
            </Text>
          </View>
          <ProgressBar value={percent} height={6} />
        </View>
      </View>
    </Pressable>
  );
}
