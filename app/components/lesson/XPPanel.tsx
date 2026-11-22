import { StyleSheet, Text, View } from "react-native";

import { colors, radius, shadow, spacing, type } from "@/lib/theme";

type XPPanelProps = {
  xpEarned: number;
  correctCount: number;
  totalCount: number;
};

/** The "+N XP" reward card on the English-Complete screen. */
export function XPPanel({ xpEarned, correctCount, totalCount }: XPPanelProps) {
  return (
    <View style={[styles.card, shadow.card]}>
      <Text style={styles.label}>YOU EARNED</Text>
      <View style={styles.xpRow}>
        <Text style={styles.star}>★</Text>
        <Text style={styles.xpValue}>+{xpEarned} XP</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {correctCount}/{totalCount}
          </Text>
          <Text style={styles.caption}>Correct</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[6],
    alignItems: "center",
    gap: spacing[2],
  },
  label: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "600", letterSpacing: 0.4 },
  xpRow: { flexDirection: "row", alignItems: "center", gap: spacing[2] },
  star: { fontSize: 24, color: colors.english },
  xpValue: { fontSize: type.display.fontSize, fontWeight: "700", color: colors.english },
  statsRow: { flexDirection: "row", gap: spacing[6], marginTop: spacing[2] },
  stat: { alignItems: "center" },
  statValue: { fontSize: type.h3.fontSize, fontWeight: "700", color: colors.ink },
  caption: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "500" },
});
