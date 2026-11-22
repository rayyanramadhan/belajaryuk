import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, type } from "@/lib/theme";

type VideoPlaceholderProps = {
  /** Shown as a small corner label — not a real video, per the MVP content shape. */
  note?: string;
};

/**
 * Stands in for a real video player (Parenting-Video mockup): a dark 16:9
 * block with a play glyph. There is no video playback in this MVP pass —
 * `lessons.content.video.url` is a placeholder string
 * (`placeholder://...`), not a real hosted asset, so this never attempts to
 * load or stream anything.
 */
export function VideoPlaceholder({ note = "Video player placeholder — embed goes here" }: VideoPlaceholderProps) {
  return (
    <View style={styles.frame}>
      <View style={styles.playCircle}>
        <Text style={styles.playGlyph}>▶</Text>
      </View>
      <Text style={styles.note}>{note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  playGlyph: { color: colors.surface, fontSize: 22 },
  note: {
    position: "absolute",
    bottom: spacing[2],
    left: spacing[3],
    fontSize: type.caption.fontSize - 1,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
});
