import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, type } from "@/lib/theme";

type StreakBadgeProps = {
  count: number;
  /** "card" = large number + "day streak" caption (dashboard English card). "pill" = compact flame + number (lesson top bar). */
  variant?: "card" | "pill";
};

function FlameIcon({ color, size }: { color: string; size: number }) {
  // The mockups draw a stroked flame SVG; react-native-svg isn't in this
  // project's dependencies, so this uses the emoji glyph already used for
  // the English track elsewhere in the app (see signup.tsx TRACK_OPTIONS).
  return (
    <View
      accessible={false}
      style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ fontSize: size * 0.9, color, lineHeight: size }}>🔥</Text>
    </View>
  );
}

export function StreakBadge({ count, variant = "pill" }: StreakBadgeProps) {
  if (variant === "card") {
    return (
      <View style={styles.cardRow}>
        <FlameIcon color={colors.english} size={28} />
        <View>
          <Text style={styles.cardCount}>{count}</Text>
          <Text style={styles.caption}>day streak</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.pill}>
      <FlameIcon color={colors.english} size={18} />
      <Text style={styles.pillCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  cardCount: { fontSize: type.h2.fontSize, fontWeight: "700", color: colors.ink, lineHeight: type.h2.fontSize },
  caption: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "500" },
  pill: { flexDirection: "row", alignItems: "center", gap: spacing[1] },
  pillCount: { fontSize: type.label.fontSize, fontWeight: "700", color: colors.english },
});
