import React, { type PropsWithChildren, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
  type TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type ScreenProps = PropsWithChildren<{
  contentStyle?: ScrollViewProps['contentContainerStyle'];
  keyboard?: boolean;
}>;

export function Screen({ children, contentStyle, keyboard = false }: ScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const content = (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingHorizontal: 22,
          paddingTop: Platform.OS === 'web' ? 67 : Math.max(insets.top, 12) + 10,
          paddingBottom:
            Platform.OS === 'web' ? 120 : Math.max(insets.bottom, 14) + 108,
        },
        contentStyle,
      ]}
    >
      {children}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {keyboard ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </View>
  );
}

export function LoadingScreen() {
  const colors = useColors();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator color={colors.primary} size="large" />
      <Text
        style={{
          color: colors.mutedForeground,
          fontFamily: 'Inter_500Medium',
          marginTop: 14,
        }}
      >
        Opening your learning space
      </Text>
    </View>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.pageHeader}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            {eyebrow.toUpperCase()}
          </Text>
        ) : null}
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeading}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        {title}
      </Text>
      {action}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  icon = 'arrow-right',
  disabled = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: disabled ? colors.muted : colors.primary,
          opacity: pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      <Text
        style={[
          styles.primaryButtonText,
          { color: disabled ? colors.mutedForeground : colors.primaryForeground },
        ]}
      >
        {title}
      </Text>
      <Feather
        name={icon}
        size={17}
        color={disabled ? colors.mutedForeground : colors.primaryForeground}
      />
    </Pressable>
  );
}

export function TextButton({
  title,
  onPress,
  testID,
}: {
  title: string;
  onPress: () => void;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1, paddingVertical: 6 })}
    >
      <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold' }}>
        {title}
      </Text>
    </Pressable>
  );
}

export function IconAction({
  icon,
  onPress,
  label,
  testID,
}: {
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  label: string;
  testID?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => ({ opacity: pressed ? 0.58 : 1, padding: 6 })}
    >
      <Feather name={icon} size={21} color={colors.foreground} />
    </Pressable>
  );
}

export function ProgressBar({
  value,
  color,
  height = 8,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  const colors = useColors();
  const width = `${Math.min(100, Math.max(0, value))}%` as TextStyle['width'];
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
      style={{
        height,
        borderRadius: 999,
        backgroundColor: colors.muted,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: '100%',
          width,
          borderRadius: 999,
          backgroundColor: color ?? colors.primary,
        }}
      />
    </View>
  );
}

export function Surface({
  children,
  style,
}: PropsWithChildren<{ style?: object }>) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.surface,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SmallLabel({ children }: PropsWithChildren) {
  const colors = useColors();
  return (
    <Text style={{ color: colors.mutedForeground, fontSize: 12, fontFamily: 'Inter_500Medium' }}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontFamily: 'Inter_700Bold',
    marginBottom: 7,
  },
  pageTitle: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.7,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_400Regular',
    marginTop: 7,
    maxWidth: 300,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 26,
    marginBottom: 13,
  },
  sectionTitle: {
    fontSize: 18,
    letterSpacing: -0.25,
    fontFamily: 'Inter_700Bold',
  },
  primaryButton: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  primaryButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    flexShrink: 1,
  },
  surface: {
    borderWidth: 1,
    padding: 17,
  },
});
