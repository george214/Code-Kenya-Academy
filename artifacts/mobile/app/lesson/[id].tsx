import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { checkCodePractice, findLesson } from '@/data/courses';
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

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonContent key={id} lessonId={id} />;
}

function LessonContent({ lessonId }: { lessonId: string }) {
  const colors = useColors();
  const found = findLesson(lessonId);
  const { progress, completeLesson, isReady } = useLearning();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [practiceCode, setPracticeCode] = useState(found?.lesson.practice.starter ?? '');
  const [isPracticeCorrect, setIsPracticeCorrect] = useState(false);
  const [practiceFeedback, setPracticeFeedback] = useState('');
  const completed = new Set(progress.completedLessonIds);

  if (!isReady) return null;
  if (!found) {
    return (
      <Screen>
        <PageHeader title="Lesson not found" subtitle="Choose a lesson from one of your learning paths." />
        <PrimaryButton title="Browse learning paths" onPress={() => router.replace('/learn')} icon="arrow-left" />
      </Screen>
    );
  }

  const { course, lesson, index } = found;
  const completedInCourse = course.lessons.filter((item) => completed.has(item.id)).length;
  const alreadyCompleted = completed.has(lesson.id);
  const canOpen = alreadyCompleted || index <= completedInCourse;
  const nextLesson = course.lessons[index + 1];

  if (!canOpen) {
    return (
      <Screen>
        <IconAction icon="arrow-left" label="Go back" onPress={() => router.back()} />
        <View style={{ alignItems: 'center', paddingTop: 48 }}>
          <Feather name="lock" size={29} color={colors.mutedForeground} />
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 21, marginTop: 17 }}>
            This lesson is locked
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 8 }}>
            Finish the earlier lessons in {course.title} to unlock it.
          </Text>
        </View>
      </Screen>
    );
  }

  const checkPractice = () => {
    const result = checkCodePractice(lesson.practice, practiceCode);
    setIsPracticeCorrect(result.isCorrect);
    setPracticeFeedback(result.feedback);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) {
      setFeedback('Choose an answer first.');
      return;
    }
    if (selectedAnswer === lesson.correctAnswer) {
      setIsCorrect(true);
      setFeedback(lesson.explanation);
    } else {
      setIsCorrect(false);
      setFeedback('Not quite yet. Re-read the example, then choose another answer.');
    }
  };

  const updatePracticeCode = (value: string) => {
    setPracticeCode(value);
    setIsPracticeCorrect(false);
    setPracticeFeedback('');
    setSelectedAnswer(null);
    setIsCorrect(false);
    setFeedback('');
  };

  const continueLesson = async () => {
    if (!alreadyCompleted) await completeLesson(lesson.id);
    if (nextLesson) {
      router.replace(`/lesson/${nextLesson.id}`);
    } else {
      router.replace(`/certificate/${course.id}`);
    }
  };

  return (
    <Screen keyboard>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17 }}>
        <IconAction icon="arrow-left" label="Back to course" onPress={() => router.back()} testID="back-from-lesson" />
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 0.8, flexShrink: 1, textAlign: 'right' }}>
          {course.title.toUpperCase()}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>
          Lesson {index + 1} of {course.lessons.length}
        </Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium', fontSize: 11 }}>
          {lesson.minutes} min
        </Text>
      </View>
      <ProgressBar value={((index + (alreadyCompleted ? 1 : 0)) / course.lessons.length) * 100} height={5} />

      <PageHeader title={lesson.title} subtitle={lesson.objective} />

      <Text style={{ color: colors.foreground, fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 24 }}>
        {lesson.content}
      </Text>

      <View style={{ backgroundColor: colors.codeSurface, borderRadius: 18, padding: 17, marginTop: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent }} />
          <Text style={{ color: colors.codeMuted, fontFamily: 'Inter_600SemiBold', fontSize: 10, letterSpacing: 1 }}>
            TRY THIS CODE
          </Text>
        </View>
        <Text selectable style={{ color: colors.codeText, fontFamily: 'monospace', fontSize: 13, lineHeight: 21 }}>
          {lesson.code}
        </Text>
      </View>

      {alreadyCompleted ? (
        <View style={{ marginTop: 22 }}>
          <Surface style={{ backgroundColor: colors.successSoft, borderColor: colors.successSoft, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Feather name="check-circle" size={19} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13, flex: 1 }}>
              Lesson completed. Nice work.
            </Text>
          </Surface>
          <View style={{ marginTop: 13 }}>
            <PrimaryButton
              title={nextLesson ? 'Go to next lesson' : 'View your certificate'}
              icon={nextLesson ? 'arrow-right' : 'award'}
              onPress={continueLesson}
              testID="continue-after-complete"
            />
          </View>
        </View>
      ) : (
        <>
          <View style={{ marginTop: 24, marginBottom: 11 }}>
            <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 }}>
              GUIDED PRACTICE
            </Text>
            <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 19, lineHeight: 25, marginTop: 7 }}>
              {lesson.practice.instruction}
            </Text>
          </View>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginBottom: 11 }}>
            Hint: {lesson.practice.hint}
          </Text>
          <TextInput
            testID="practice-code-input"
            accessibilityLabel="Editable practice code"
            value={practiceCode}
            onChangeText={updatePracticeCode}
            multiline
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            textAlignVertical="top"
            selectionColor={colors.accent}
            style={{
              backgroundColor: colors.codeSurface,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              color: colors.codeText,
              fontFamily: 'monospace',
              fontSize: 13,
              lineHeight: 21,
              minHeight: 142,
              padding: 14,
            }}
          />
          <View style={{ marginTop: 12 }}>
            <PrimaryButton
              title={isPracticeCorrect ? 'Check my code again' : 'Check my code'}
              icon={isPracticeCorrect ? 'check-circle' : 'code'}
              onPress={checkPractice}
              testID="check-practice"
            />
          </View>
          {practiceFeedback ? (
            <View
              accessibilityRole="alert"
              style={{
                backgroundColor: isPracticeCorrect ? colors.successSoft : colors.warningSoft,
                padding: 13,
                borderRadius: 14,
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 9,
              }}
            >
              <Feather
                name={isPracticeCorrect ? 'check-circle' : 'info'}
                size={17}
                color={isPracticeCorrect ? colors.success : colors.warning}
                style={{ marginTop: 1 }}
              />
              <Text style={{ color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 19, flex: 1 }}>
                {practiceFeedback}
              </Text>
            </View>
          ) : null}

          {isPracticeCorrect ? (
            <>
              <View style={{ marginTop: 24, marginBottom: 12 }}>
                <Text style={{ color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.2 }}>
                  QUICK CHECK
                </Text>
                <Text style={{ color: colors.foreground, fontFamily: 'Inter_700Bold', fontSize: 19, lineHeight: 25, marginTop: 7 }}>
                  {lesson.question}
                </Text>
              </View>
              <View style={{ gap: 9 }}>
                {lesson.answers.map((answer, answerIndex) => {
                  const selected = selectedAnswer === answerIndex;
                  const correctChoice = isCorrect && answerIndex === lesson.correctAnswer;
                  return (
                    <Pressable
                      key={answer}
                      testID={`answer-${answerIndex}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      disabled={isCorrect}
                      onPress={() => {
                        setSelectedAnswer(answerIndex);
                        setFeedback('');
                      }}
                      style={({ pressed }) => ({
                        minHeight: 53,
                        borderWidth: 1,
                        borderColor: correctChoice ? colors.success : selected ? colors.primary : colors.border,
                        backgroundColor: correctChoice ? colors.successSoft : selected ? colors.secondary : colors.card,
                        borderRadius: 15,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <View style={{ width: 23, height: 23, borderRadius: 8, borderWidth: 1, borderColor: correctChoice ? colors.success : selected ? colors.primary : colors.border, alignItems: 'center', justifyContent: 'center' }}>
                        {correctChoice ? <Feather name="check" size={14} color={colors.primary} /> : null}
                      </View>
                      <Text style={{ color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, flex: 1 }}>
                        {answer}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {feedback ? (
                <View
                  accessibilityRole="alert"
                  style={{
                    backgroundColor: isCorrect ? colors.successSoft : colors.warningSoft,
                    padding: 13,
                    borderRadius: 14,
                    marginTop: 12,
                  }}
                >
                  <Text style={{ color: colors.foreground, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 19 }}>
                    {feedback}
                  </Text>
                </View>
              ) : null}
              <View style={{ marginTop: 14 }}>
                {isCorrect ? (
                  <PrimaryButton
                    title={nextLesson ? 'Complete lesson and continue' : 'Finish path and view certificate'}
                    icon={nextLesson ? 'arrow-right' : 'award'}
                    onPress={continueLesson}
                    testID="complete-lesson"
                  />
                ) : (
                  <PrimaryButton
                    title="Check my answer"
                    icon="check"
                    disabled={selectedAnswer === null}
                    onPress={checkAnswer}
                    testID="check-answer"
                  />
                )}
              </View>
            </>
          ) : (
            <View
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 15,
                padding: 14,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 9,
              }}
            >
              <Feather name="edit-3" size={16} color={colors.primary} style={{ marginTop: 1 }} />
              <Text style={{ color: colors.secondaryForeground, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 19, flex: 1 }}>
                Finish the code practice to unlock the quick check.
              </Text>
            </View>
          )}
        </>
      )}
    </Screen>
  );
}
