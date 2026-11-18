import React, { useState } from 'react';
import { Alert, Platform, Share, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { findCourse } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import { IconAction, PageHeader, PrimaryButton, Screen } from '@/components/Shared';
import { useColors } from '@/hooks/useColors';

export default function CertificateScreen() {
  const colors = useColors();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { progress, isReady } = useLearning();
  const [shareError, setShareError] = useState(false);
  const course = findCourse(courseId);

  if (!isReady) return null;
  if (!course) {
    return (
      <Screen>
        <PageHeader title="Certificate not found" subtitle="Choose a learning path to view its certificate." />
        <PrimaryButton title="Browse learning paths" onPress={() => router.replace('/learn')} icon="arrow-left" />
      </Screen>
    );
  }

  const completedAt = progress.certificateDates[course.id];
  if (!completedAt) {
    return (
      <Screen>
        <IconAction icon="arrow-left" label="Go back" onPress={() => router.back()} />
        <View style={{ alignItems: 'center', paddingTop: 45 }}>
          <Feather name="award" size={33} color={colors.mutedForeground} />
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 21, textAlign: 'center', marginTop: 15 }}>
            Your certificate is waiting
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8, marginBottom: 22 }}>
            Complete all {course.lessons.length} lessons in {course.title} to earn it.
          </Text>
          <PrimaryButton title="Continue learning" onPress={() => router.replace(`/course/${course.id}`)} icon="arrow-right" />
        </View>
      </Screen>
    );
  }

  const dateLabel = new Date(`${completedAt}T12:00:00`).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const learner = progress.displayName.trim() || 'Learner';
  const certificateMessage = `${learner} has completed ${course.title} on Code Campus KE (${dateLabel}).`;

  const shareCertificate = async () => {
    try {
      await Share.share({
        title: `${course.title} certificate`,
        message: certificateMessage,
      });
      setShareError(false);
    } catch {
      setShareError(true);
      if (Platform.OS !== 'web') {
        Alert.alert('Sharing unavailable', 'Your certificate is saved in Code Campus KE.');
      }
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
        <IconAction icon="arrow-left" label="Go back" onPress={() => router.back()} />
        <Text style={{ color: colors.mutedForeground, fontSize: 10, letterSpacing: 1.1, fontFamily: 'Inter_700Bold' }}>
          CERTIFICATE
        </Text>
        <View style={{ width: 33 }} />
      </View>

      <View style={{ backgroundColor: colors.certificatePaper, borderWidth: 1, borderColor: colors.certificateBorder, borderRadius: 25, padding: 22, overflow: 'hidden' }}>
        <View style={{ height: 5, backgroundColor: colors.primary, borderRadius: 99, marginBottom: 22 }} />
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 59, height: 59, borderRadius: 20, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="award" size={29} color={colors.primary} />
          </View>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.8, marginTop: 16 }}>
            CODE CAMPUS KE
          </Text>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 31, letterSpacing: -0.6, textAlign: 'center', marginTop: 12 }}>
            Certificate of completion
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 18 }}>
            This recognises that
          </Text>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 23, textAlign: 'center', marginTop: 7 }}>
            {learner}
          </Text>
          <View style={{ height: 1, width: '75%', backgroundColor: colors.certificateBorder, marginTop: 12 }} />
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 20, marginTop: 15 }}>
            completed the learning path
          </Text>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 18, textAlign: 'center', lineHeight: 24, marginTop: 4 }}>
            {course.title}
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 17 }}>
            {dateLabel}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 17 }}>
            <Feather name="check-circle" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>
              {course.lessons.length} lessons completed
            </Text>
          </View>
        </View>
        <View style={{ height: 5, backgroundColor: colors.accent, borderRadius: 99, marginTop: 23 }} />
      </View>

      <View style={{ marginTop: 17 }}>
        <PrimaryButton
          title="Share your achievement"
          icon="share-2"
          onPress={shareCertificate}
          testID="share-certificate"
        />
      </View>
      {shareError ? (
        <Text accessibilityRole="alert" style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 }}>
          Sharing is not available here. Your certificate remains saved on this device.
        </Text>
      ) : null}
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 16 }}>
        This digital certificate recognises completion of a Code Campus KE learning path.
      </Text>
    </Screen>
  );
}
