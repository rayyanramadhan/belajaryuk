import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, type } from "@/lib/theme";

/**
 * Stub post-auth landing spot. Out of scope for this pass: no dashboard,
 * lesson list, or course content here — Pandu/Bagas own what comes next.
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>You&apos;re in!</Text>
      <Text style={styles.subtitle}>
        Signed in successfully. The real home screen hasn&apos;t been built yet.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing[3],
    padding: spacing[6],
  },
  emoji: { fontSize: 40 },
  title: { fontSize: type.h1.fontSize, fontWeight: "700", color: colors.ink },
  subtitle: {
    fontSize: type.body.fontSize,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 320,
  },
});
