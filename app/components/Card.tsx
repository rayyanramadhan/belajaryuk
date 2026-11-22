import { StyleSheet, View, type ViewProps } from "react-native";

import { colors, radius, shadow, spacing } from "@/lib/theme";

export type CardVariant = "default" | "english-accent" | "parenting-accent";

type CardProps = {
  variant?: CardVariant;
  children: React.ReactNode;
} & ViewProps;

const ACCENT_BAR_COLOR: Record<CardVariant, string | undefined> = {
  default: undefined,
  "english-accent": colors.english,
  "parenting-accent": colors.parenting,
};

export function Card({ variant = "default", children, style, ...rest }: CardProps) {
  const accentColor = ACCENT_BAR_COLOR[variant];

  return (
    <View style={[styles.card, shadow.card, style]} {...rest}>
      {accentColor && <View style={[styles.accentBar, { backgroundColor: accentColor }]} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  accentBar: {
    height: 6,
    width: "100%",
  },
  content: {
    padding: spacing[6],
    gap: spacing[3],
  },
});
