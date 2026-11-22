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
import { colors, spacing, type } from "@/lib/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin() {
    setErrorMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage("That password didn't work — check it and try again.");
        return;
      }
      router.replace("/home");
    } catch {
      setErrorMessage("That password didn't work — check it and try again.");
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
            <Text style={styles.subtitle}>Welcome back</Text>
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
            />

            <Input
              label="Password"
              labelRight={
                <Pressable accessibilityRole="link" onPress={() => {}}>
                  <Text style={styles.forgotLink}>Forgot password?</Text>
                </Pressable>
              }
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              error={errorMessage ?? undefined}
            />

            <Button
              label="Log in"
              loadingLabel="Logging in…"
              loading={loading}
              onPress={handleLogin}
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

          <Text style={styles.footerText}>
            New to belajaryuk?{" "}
            <Link href="/signup" style={styles.footerLink}>
              Sign up free
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
  form: { gap: spacing[5] },
  forgotLink: {
    fontSize: type.caption.fontSize,
    fontWeight: "600",
    color: colors.brand,
  },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.mist },
  dividerText: { fontSize: type.caption.fontSize, color: colors.muted },
  oauthRow: { flexDirection: "row", gap: spacing[3] },
  footerText: { textAlign: "center", fontSize: type.body.fontSize, color: colors.ink },
  footerLink: { fontWeight: "600", color: colors.brand },
});
