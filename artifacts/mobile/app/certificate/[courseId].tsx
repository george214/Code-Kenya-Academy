import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Share,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { findCourse } from '@/data/courses';
import { useLearning } from '@/context/LearningContext';
import { IconAction, PageHeader, PrimaryButton, Screen } from '@/components/Shared';
import { useColors } from '@/hooks/useColors';
import colorTokens from '@/constants/colors';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createCertificateHtml({
  learner,
  courseTitle,
  dateLabel,
  lessonCount,
}: {
  learner: string;
  courseTitle: string;
  dateLabel: string;
  lessonCount: number;
}) {
  const theme = colorTokens.light;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(courseTitle)} certificate</title>
    <style>
      @page { size: A4 landscape; margin: 0; }
      * { box-sizing: border-box; }
      html, body {
        width: 297mm;
        height: 210mm;
        margin: 0;
        padding: 0;
      }
      body {
        color: ${theme.foreground};
        background: ${theme.certificatePaper};
        font-family: Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .sheet {
        width: 100%;
        height: 100%;
        padding: 14mm;
        background: ${theme.certificatePaper};
      }
      .frame {
        width: 100%;
        height: 100%;
        padding: 2mm;
        border: 1px solid ${theme.certificateBorder};
      }
      .certificate {
        position: relative;
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 13mm 20mm;
        border: 2px solid ${theme.certificateBorder};
        text-align: center;
      }
      .top-rule, .bottom-rule {
        position: absolute;
        right: 0;
        left: 0;
        height: 4mm;
        background: ${theme.primary};
      }
      .top-rule { top: 0; }
      .bottom-rule { bottom: 0; background: ${theme.accent}; }
      .seal {
        display: flex;
        width: 21mm;
        height: 21mm;
        align-items: center;
        justify-content: center;
        border: 1.3mm solid ${theme.accent};
        border-radius: 50%;
        color: ${theme.primary};
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 17pt;
        font-weight: bold;
      }
      .brand {
        margin-top: 4mm;
        color: ${theme.primary};
        font-size: 9pt;
        font-weight: bold;
        letter-spacing: 3pt;
      }
      .title {
        margin-top: 4mm;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 25pt;
        font-weight: normal;
      }
      .intro, .completion, .date, .lessons {
        color: ${theme.mutedForeground};
      }
      .intro {
        margin-top: 6mm;
        font-size: 10pt;
      }
      .learner {
        max-width: 220mm;
        margin-top: 2mm;
        color: ${theme.primary};
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 27pt;
        font-weight: bold;
        overflow-wrap: anywhere;
      }
      .divider {
        width: 125mm;
        height: 0;
        margin-top: 3mm;
        border-top: 1px solid ${theme.certificateBorder};
      }
      .completion {
        margin-top: 4mm;
        font-size: 10pt;
      }
      .course {
        max-width: 225mm;
        margin-top: 1mm;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 17pt;
        font-weight: bold;
        overflow-wrap: anywhere;
      }
      .date {
        margin-top: 5mm;
        font-size: 10pt;
      }
      .lessons {
        margin-top: 3mm;
        font-size: 8.5pt;
        letter-spacing: 0.5pt;
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <div class="frame">
        <section class="certificate">
          <div class="top-rule"></div>
          <div class="seal">CC</div>
          <div class="brand">CODE CAMPUS KE</div>
          <div class="title">Certificate of Completion</div>
          <div class="intro">This certificate is proudly presented to</div>
          <div class="learner">${escapeHtml(learner)}</div>
          <div class="divider"></div>
          <div class="completion">for completing the learning path</div>
          <div class="course">${escapeHtml(courseTitle)}</div>
          <div class="date">Completed ${escapeHtml(dateLabel)}</div>
          <div class="lessons">${lessonCount} LESSONS COMPLETED</div>
          <div class="bottom-rule"></div>
        </section>
      </div>
    </main>
  </body>
</html>`;
}

export default function CertificateScreen() {
  const colors = useColors();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { progress, isReady } = useLearning();
  const [shareError, setShareError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
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
        Alert.alert(
          'Sharing unavailable',
          'Your earned certificate is still available in Code Campus KE.',
        );
      }
    }
  };

  const saveOrSharePdf = async () => {
    if (Platform.OS === 'web' || isPreparingPdf) return;

    setIsPreparingPdf(true);
    setPdfError(false);
    try {
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error('File sharing is unavailable on this device.');
      }

      const pdf = await Print.printToFileAsync({
        html: createCertificateHtml({
          learner,
          courseTitle: course.title,
          dateLabel,
          lessonCount: course.lessons.length,
        }),
        width: 842,
        height: 595,
        margins: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      if (pdf.numberOfPages !== 1) {
        throw new Error('The certificate did not fit on one page.');
      }

      await Sharing.shareAsync(pdf.uri, {
        dialogTitle: `${course.title} certificate`,
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } catch {
      setPdfError(true);
      Alert.alert(
        'PDF unavailable',
        'We could not create or share your certificate. Please try again.',
      );
    } finally {
      setIsPreparingPdf(false);
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

      {Platform.OS !== 'web' ? (
        <View style={{ marginTop: 17 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isPreparingPdf }}
            disabled={isPreparingPdf}
            onPress={saveOrSharePdf}
            testID="save-share-certificate-pdf"
            style={({ pressed }) => ({
              minHeight: 54,
              paddingHorizontal: 18,
              borderRadius: 16,
              backgroundColor: colors.primary,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Text
              style={{
                flex: 1,
                color: colors.primaryForeground,
                fontFamily: 'Inter_600SemiBold',
                fontSize: 15,
              }}
            >
              {isPreparingPdf ? 'Preparing certificate PDF…' : 'Save or share PDF'}
            </Text>
            {isPreparingPdf ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Feather name="download" size={18} color={colors.primaryForeground} />
            )}
          </Pressable>
          <Text
            style={{
              color: colors.mutedForeground,
              fontFamily: 'Inter_400Regular',
              fontSize: 12,
              lineHeight: 18,
              textAlign: 'center',
              marginTop: 9,
            }}
          >
            Create a one-page certificate to save or send from your device.
          </Text>
        </View>
      ) : null}

      <View style={{ marginTop: 17 }}>
        <Pressable
          accessibilityRole="button"
          onPress={shareCertificate}
          testID="share-certificate"
          style={({ pressed }) => ({
            minHeight: 50,
            paddingHorizontal: 18,
            borderRadius: 16,
            backgroundColor: colors.secondary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Feather name="share-2" size={17} color={colors.secondaryForeground} />
          <Text
            style={{
              color: colors.secondaryForeground,
              fontFamily: 'Inter_600SemiBold',
              fontSize: 14,
            }}
          >
            Share achievement message
          </Text>
        </Pressable>
      </View>
      {shareError ? (
        <Text accessibilityRole="alert" style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 }}>
          Sharing is unavailable right now. Your earned certificate is still available here.
        </Text>
      ) : null}
      {pdfError ? (
        <Text accessibilityRole="alert" style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 10 }}>
          We could not prepare the PDF. Your certificate is still available in the app.
        </Text>
      ) : null}
      <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 16 }}>
        This digital certificate recognises completion of a Code Campus KE learning path.
      </Text>
    </Screen>
  );
}
