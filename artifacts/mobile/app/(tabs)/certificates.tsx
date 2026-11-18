import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { courses } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import { PageHeader, PrimaryButton, Screen, Surface } from '@/components/Shared';
import { useColors } from '@/hooks/useColors';

export default function CertificatesScreen() {
  const colors = useColors();
  const { progress, isReady } = useLearning();
  const completed = new Set(progress.completedLessonIds);

  if (!isReady) return null;

  const earnedCount = Object.keys(progress.certificateDates).length;

  return (
    <Screen>
      <PageHeader
        eyebrow="Proof of your hard work"
        title="Certificates"
        subtitle="Finish every lesson in a path to earn a digital certificate of completion."
      />

      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 22,
          padding: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          marginBottom: 19,
        }}
      >
        <View style={{ width: 47, height: 47, borderRadius: 16, backgroundColor: colors.primaryForeground, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="award" size={23} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.primaryForeground, fontFamily: 'Inter_700Bold', fontSize: 20 }}>
            {earnedCount} earned
          </Text>
          <Text style={{ color: colors.primaryForeground, opacity: 0.8, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 3 }}>
            Keep learning to unlock your next one.
          </Text>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {courses.map((course) => {
          const date = progress.certificateDates[course.id];
          const count = course.lessons.filter((lesson) => completed.has(lesson.id)).length;
          const isComplete = !!date;
          return (
            <Surface key={course.id} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                <View style={{ width: 43, height: 43, borderRadius: 14, backgroundColor: isComplete ? colors.successSoft : colors.muted, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={isComplete ? 'award' : 'lock'} size={19} color={isComplete ? colors.primary : colors.mutedForeground} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 15 }}>
                    {course.title}
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 4 }}>
                    {isComplete
                      ? `Completed ${new Date(`${date}T12:00:00`).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}`
                      : `${course.lessons.length - count} lessons left to earn this certificate`}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    testID={`${isComplete ? 'view' : 'continue'}-certificate-${course.id}`}
                    onPress={() =>
                      isComplete
                        ? router.push(`/certificate/${course.id}`)
                        : router.push(`/course/${course.id}`)
                    }
                    style={({ pressed }) => ({
                      alignSelf: 'flex-start',
                      marginTop: 12,
                      opacity: pressed ? 0.65 : 1,
                    })}
                  >
                    <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
                      {isComplete ? 'View certificate' : 'Continue learning'}
                    </Text>
                  </Pressable>
                </View>
                {isComplete ? <Feather name="check-circle" size={18} color={colors.primary} /> : null}
              </View>
            </Surface>
          );
        })}
      </View>

      {earnedCount === 0 ? (
        <View style={{ marginTop: 18 }}>
          <PrimaryButton
            title="Start your first learning path"
            onPress={() => router.push('/learn')}
            icon="book-open"
            testID="start-first-path"
          />
        </View>
      ) : null}

      <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 20 }}>
        These certificates recognise completion of learning paths in Code Campus KE.
      </Text>
    </Screen>
  );
}
