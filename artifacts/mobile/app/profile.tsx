import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { IconAction, PageHeader, PrimaryButton, Screen, Surface } from '@/components/Shared';
import { useLearning } from '@/context/LearningContext';
import { useColors } from '@/hooks/useColors';

export default function ProfileScreen() {
  const colors = useColors();
  const { progress, updateDisplayName, isReady } = useLearning();
  const [name, setName] = useState(progress.displayName);
  const [saved, setSaved] = useState(false);

  if (!isReady) return null;

  return (
    <Screen keyboard>
      <View style={{ marginBottom: 13 }}>
        <IconAction icon="arrow-left" label="Go back" onPress={() => router.back()} testID="back-from-profile" />
      </View>
      <PageHeader
        eyebrow="Your learning space"
        title="Your profile"
        subtitle="Add the name you want to appear on your completion certificates."
      />
      <Surface>
        <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13, marginBottom: 9 }}>
          Name for certificates
        </Text>
        <TextInput
          testID="certificate-name-input"
          accessibilityLabel="Name for certificates"
          value={name}
          onChangeText={(value) => {
            setName(value);
            setSaved(false);
          }}
          placeholder="Enter your name"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={26}
          returnKeyType="done"
          style={{
            minHeight: 51,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.input,
            backgroundColor: colors.background,
            color: colors.foreground,
            paddingHorizontal: 13,
            fontFamily: 'Inter_500Medium',
            fontSize: 14,
          }}
        />
        <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 17, marginTop: 8 }}>
          Your name and learning progress are stored on this device. No account is needed.
        </Text>
      </Surface>
      <View style={{ marginTop: 14 }}>
        <PrimaryButton
          title={saved ? 'Name saved' : 'Save name'}
          icon={saved ? 'check' : 'save'}
          testID="save-profile-name"
          onPress={async () => {
            await updateDisplayName(name);
            setName(name.trim() || 'Learner');
            setSaved(true);
          }}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Surface style={{ backgroundColor: colors.secondary, borderColor: colors.secondary }}>
          <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>
            Learn at your own pace
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 19, marginTop: 5 }}>
            Code Campus KE keeps your lessons, streak, and earned certificates on this device.
          </Text>
        </Surface>
      </View>
    </Screen>
  );
}
