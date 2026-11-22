import { StyleSheet, View } from "react-native";

import { colors, radius } from "@/lib/theme";

type LinearProgressProps = {
  /** 0-1 fraction filled. */
  progress: number;
  color?: string;
  /** 6px in the Parenting quiz player, 8px on the Home dashboard cards. */
  height?: number;
};

/** The thin continuous progress bar used in the Parenting quiz player and the Home dashboard cards. */
export function LinearProgress({ progress, color = colors.parenting, height = 6 }: LinearProgressProps) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={[styles.track, { height, borderRadius: radius.sm }]} accessibilityRole="progressbar">
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: colors.mist, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
});
