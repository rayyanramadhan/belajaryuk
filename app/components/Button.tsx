import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";

import { colors, radius, spacing, type } from "@/lib/theme";

export type ButtonVariant = "primary" | "secondary" | "track-english" | "track-parenting";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  /** Shown instead of `label` while `loading` is true, e.g. "Creating account…". */
  loadingLabel?: string;
} & Pick<PressableProps, "accessibilityLabel">;

const VARIANT_STYLES: Record<ButtonVariant, { background: string; text: string; border?: string }> = {
  primary: { background: colors.brand, text: colors.surface },
  secondary: { background: colors.surface, text: colors.ink, border: colors.mist },
  // English track buttons use dark ink text on the ember accent, not white.
  "track-english": { background: colors.english, text: colors.ink },
  "track-parenting": { background: colors.parenting, text: colors.surface },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  loadingLabel,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = isDisabled
    ? { background: colors.mist, text: colors.muted, border: undefined }
    : VARIANT_STYLES[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: variantStyle.background,
          borderColor: variantStyle.border,
          borderWidth: variantStyle.border ? 1 : 0,
          opacity: pressed && !isDisabled ? 0.85 : 1,
        },
      ]}
    >
      {/* Loading swaps the label to in-progress copy; the button keeps its size, no icon. */}
      <Text style={[styles.label, { color: variantStyle.text }]}>
        {loading ? loadingLabel ?? label : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    paddingHorizontal: spacing[6],
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    fontSize: type.bodyMedium.fontSize,
    lineHeight: type.bodyMedium.lineHeight,
    fontWeight: type.bodyMedium.fontWeight,
  },
});
