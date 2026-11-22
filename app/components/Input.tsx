import { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, radius, spacing, type } from "@/lib/theme";

type InputProps = {
  label: string;
  error?: string;
  helper?: string;
  /** Optional element rendered at the end of the label row, e.g. a "Forgot password?" link. */
  labelRight?: React.ReactNode;
} & TextInputProps;

export function Input({ label, error, helper, labelRight, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);

  const borderColor = hasError ? colors.error : focused ? colors.brand : colors.mist;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelRight}
      </View>
      <TextInput
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={colors.muted}
        style={[
          styles.field,
          {
            borderColor,
            // Approximates the web `shadow-focus` ring with a slightly thicker border,
            // since RN has no native box-shadow ring.
            borderWidth: focused && !hasError ? 2 : 1,
          },
          style,
        ]}
      />
      {(error || helper) && (
        <Text style={[styles.helper, hasError && styles.helperError]}>{error ?? helper}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  label: {
    fontSize: type.label.fontSize,
    lineHeight: type.label.lineHeight,
    fontWeight: type.label.fontWeight,
    color: colors.ink,
  },
  field: {
    height: 48,
    paddingHorizontal: spacing[3],
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontSize: type.body.fontSize,
  },
  helper: {
    fontSize: type.caption.fontSize,
    lineHeight: type.caption.lineHeight,
    fontWeight: type.caption.fontWeight,
    color: colors.muted,
  },
  helperError: {
    color: colors.error,
  },
});
