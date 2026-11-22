import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, type } from "@/lib/theme";

export type OptionState = "default" | "selected" | "correct" | "incorrect" | "matched";
export type OptionVariant = "mcq" | "quiz" | "tile";

type OptionTileProps = {
  label: string;
  state?: OptionState;
  variant?: OptionVariant;
  accentColor?: string;
  accentTint?: string;
  onPress?: () => void;
  disabled?: boolean;
};

/**
 * Shared selectable control for mcq options (English-MC), quiz options
 * (Parenting-Quiz) and match-pairs tiles (English-Match) — the mockups use
 * the same visual language (default/selected/correct border + tint) across
 * all three, just with different layout (full-width row vs. centered tile,
 * radio vs. no radio).
 */
export function OptionTile({
  label,
  state = "default",
  variant = "mcq",
  accentColor = colors.english,
  accentTint = colors.englishTint,
  onPress,
  disabled,
}: OptionTileProps) {
  const isEmphasized = state === "selected" || state === "correct" || state === "matched";
  const borderColor =
    state === "incorrect" ? colors.error : isEmphasized ? accentColor : colors.mist;
  const backgroundColor =
    state === "incorrect" ? "#FBEAEA" : isEmphasized ? accentTint : colors.surface;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: state === "selected" || state === "matched", disabled }}
      style={[
        variant === "tile" ? styles.tile : styles.option,
        { borderColor, backgroundColor, opacity: state === "matched" ? 0.6 : 1 },
      ]}
    >
      {variant === "quiz" && (
        <View
          style={[
            styles.radio,
            { borderColor: isEmphasized ? accentColor : colors.mist, backgroundColor: isEmphasized ? accentColor : "transparent" },
          ]}
        />
      )}
      <Text
        style={[
          variant === "tile" ? styles.tileLabel : styles.optionLabel,
          variant === "tile" && isEmphasized ? { color: accentColor } : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    width: "100%",
    borderWidth: 1.5,
    borderRadius: radius.md,
    padding: spacing[4],
  },
  optionLabel: {
    flex: 1,
    fontSize: type.body.fontSize,
    lineHeight: type.body.lineHeight,
    fontWeight: "500",
    color: colors.ink,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    marginTop: 1,
    flexShrink: 0,
  },
  tile: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderRadius: radius.md,
  },
  tileLabel: {
    fontSize: type.body.fontSize,
    fontWeight: "600",
    color: colors.ink,
  },
});
