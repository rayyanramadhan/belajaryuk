import { useState } from "react";
import { Link, router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { supabase } from "@/lib/supabase";
import { colors, radius, spacing, type } from "@/lib/theme";

type TrackInterest = "english" | "parenting" | "both";

const TRACK_OPTIONS: { value: TrackInterest; label: string; icon: string }[] = [
  { value: "english", label: "English", icon: "🔥" },
  { value: "parenting", label: "Parenting", icon: "▶" },
  { value: "both", label: "Both", icon: "✨" },
];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function SignUpScreen() {
  const [trackInterest, setTrackInterest] = useState<TrackInterest>("english");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSignUp() {
    setEmailError(null);
    setPasswordError(null);

    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setPasswordError("That password didn't work — check it and try again.");
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        // Bagas is adding `track_interest` to `profiles` concurrently — if the
        // migration hasn't landed yet this upsert fails with an "unknown
        // column" Postgres error. Catch it and don't block signup on it.
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: userId, track_interest: trackInterest });

        if (profileError) {
          // TODO(wira): once Bagas's `track_interest` migration is confirmed
          // live, remove this catch — the upsert should always succeed.
          console.warn(
            "Could not save track_interest (column may not exist yet):",
            profileError.message
          );
        }
      }

      router.replace("/home");
    } catch {
      setPasswordError("That password didn't work — check it and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.wordmark}>belajaryuk</Text>
            <Text style={styles.subtitle}>Create your free account</Text>
          </View>

          <View style={styles.trackSection}>
            <Text style={styles.label}>I want to learn</Text>
            <View style={styles.trackRow}>
              {TRACK_OPTIONS.map((option) => {
                const selected = trackInterest === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setTrackInterest(option.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={[
                      styles.trackOption,
                      {
                        borderColor: selected ? colors.english : colors.mist,
                        borderWidth: selected ? 2 : 1,
                        backgroundColor: selected ? colors.englishTint : colors.surface,
                      },
                    ]}
                  >
                    <Text style={styles.trackIcon}>{option.icon}</Text>
                    <Text style={styles.trackLabel}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.form}>
            <Input
              label="Email"
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              error={emailError ?? undefined}
            />
            <Input
              label="Password"
              placeholder="At least 8 characters"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              error={passwordError ?? undefined}
            />

            <Button
              label="Create account"
              loadingLabel="Creating account…"
              loading={loading}
              onPress={handleSignUp}
              disabled={!email || !password}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.oauthRow}>
            <Button label="Google" variant="secondary" disabled onPress={() => {}} />
            <Button label="Apple" variant="secondary" disabled onPress={() => {}} />
          </View>

          <Text style={styles.legalText}>
            By signing up, you agree to belajaryuk&apos;s{" "}
            <Text style={styles.legalLink}>Terms</Text> and{" "}
            <Text style={styles.legalLink}>Privacy Policy</Text>.
          </Text>

          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href="/login" style={styles.footerLink}>
              Log in
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    padding: spacing[6],
    paddingTop: spacing[12],
  },
  card: {
    width: "100%",
    maxWidth: 420,
    gap: spacing[8],
  },
  header: { alignItems: "center", gap: spacing[1] },
  wordmark: { fontSize: type.h2.fontSize, fontWeight: "800", color: colors.ink },
  subtitle: { fontSize: type.body.fontSize, color: colors.muted },
  trackSection: { gap: spacing[3] },
  label: {
    fontSize: type.label.fontSize,
    fontWeight: type.label.fontWeight,
    color: colors.ink,
  },
  trackRow: { flexDirection: "row", gap: spacing[3] },
  trackOption: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    alignItems: "center",
    gap: spacing[2] / 2,
  },
  trackIcon: { fontSize: 20 },
  trackLabel: { fontSize: type.label.fontSize, fontWeight: "600", color: colors.ink },
  form: { gap: spacing[5] },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.mist },
  dividerText: { fontSize: type.caption.fontSize, color: colors.muted },
  oauthRow: { flexDirection: "row", gap: spacing[3] },
  legalText: {
    textAlign: "center",
    fontSize: type.caption.fontSize,
    fontWeight: type.caption.fontWeight,
    color: colors.muted,
  },
  legalLink: { color: colors.brand, fontWeight: "600" },
  footerText: { textAlign: "center", fontSize: type.body.fontSize, color: colors.ink },
  footerLink: { fontWeight: "600", color: colors.brand },
});
