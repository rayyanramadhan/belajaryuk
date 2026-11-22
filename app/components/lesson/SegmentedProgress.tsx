import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/lib/theme";

type SegmentedProgressProps = {
  /** Total number of exercises/segments. */
  total: number;
  /** 0-based index of the currently active segment. */
  activeIndex: number;
  color?: string;
};

/**
 * The per-exercise segmented bar in the English drill player top bar
 * (English-MC/Fill/Match mockups): one pill per exercise, filled for
 * completed + active, outlined for the active one, muted for the rest.
 */
export function SegmentedProgress({ total, activeIndex, color = colors.english }: SegmentedProgressProps) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={`Question ${activeIndex + 1} of ${total}`}>
      {Array.from({ length: total }).map((_, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.segment,
              {
                backgroundColor: done || active ? color : colors.mist,
                borderWidth: active ? 2 : 0,
                borderColor: color,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: "row", gap: 6 },
  segment: { flex: 1, height: 8, borderRadius: radius.sm },
});
