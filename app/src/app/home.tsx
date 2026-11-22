import { useEffect, useState } from "react";
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { LinearProgress } from "@/components/lesson/LinearProgress";
import { StreakBadge } from "@/components/lesson/StreakBadge";
import { fetchDashboardData, type TrackDashboard } from "@/lib/lessons";
import { colors, spacing, type } from "@/lib/theme";
import { useSession } from "@/lib/useSession";

export default function HomeScreen() {
  const { session, loading: sessionLoading } = useSession();
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchDashboardData>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = session?.user.id;

  // Canonical "fetch on mount" effect shape (react.dev data-fetching guide):
  // the async work and its setState calls live inside the effect itself,
  // guarded by an `ignore` flag, rather than being delegated to a named
  // callback — keeps react-hooks/set-state-in-effect happy. `retryToken`
  // lets the retry button re-run this without duplicating the fetch logic.
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/login");
      return;
    }
    if (!userId) return;

    let ignore = false;
    fetchDashboardData(userId)
      .then((dashboard) => {
        if (ignore) return;
        setData(dashboard);
        setError(null);
      })
      .catch(() => {
        if (ignore) return;
        setError("Couldn't load your dashboard. Pull to refresh or try again shortly.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [session, sessionLoading, userId, retryToken]);

  function retry() {
    setLoading(true);
    setError(null);
    setRetryToken((t) => t + 1);
  }

  if (sessionLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>{error ?? "Something went wrong."}</Text>
        <View style={{ width: 160, marginTop: spacing[4] }}>
          <Button label="Retry" onPress={retry} />
        </View>
      </View>
    );
  }

  const displayName = data.profile?.display_name?.trim() || (session?.user.email ?? "there");
  const initial = displayName.charAt(0).toUpperCase() || "?";
  const greeting = getGreeting();

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View>
          <Text style={styles.caption}>{greeting}</Text>
          <Text style={styles.h2}>Hi, {displayName}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </View>

      {data.english && (
        <EnglishCard dashboard={data.english} streak={data.englishStreak} />
      )}

      {data.parenting && <ParentingCard dashboard={data.parenting} />}

      {!data.english && !data.parenting && (
        <Card>
          <Text style={styles.h3}>No track selected yet</Text>
          <Text style={styles.body}>
            We couldn&apos;t find a track for your account. Try signing up again or contact support.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function EnglishCard({ dashboard, streak }: { dashboard: TrackDashboard; streak: number }) {
  const { course, lessons, nextLesson, completedCount } = dashboard;
  const total = lessons.length;

  return (
    <Card variant="english-accent">
      <View style={styles.cardTopRow}>
        <View style={styles.flameChip}>
          <Text style={styles.flameEmoji}>🔥</Text>
        </View>
        <StreakBadge count={streak} variant="card" />
        <View style={{ flex: 1 }} />
        <Text style={[styles.trackPill, { color: colors.english, backgroundColor: colors.englishTint }]}>
          ENGLISH
        </Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.label}>{course.title}</Text>
          <Text style={styles.caption}>
            {completedCount}/{total} lessons
          </Text>
        </View>
        <LinearProgress
          progress={total > 0 ? completedCount / total : 0}
          color={colors.english}
          height={8}
        />
      </View>

      <View style={styles.divider} />

      {nextLesson ? (
        <>
          <View style={{ gap: 2 }}>
            <Text style={styles.caption}>Next up</Text>
            <Text style={styles.h3}>Lesson {nextLesson.position}</Text>
            <Text style={styles.caption}>
              {("exercises" in nextLesson.content ? nextLesson.content.exercises.length : 0)} exercises ·{" "}
              {"xp_reward" in nextLesson.content ? nextLesson.content.xp_reward : 0} XP
            </Text>
          </View>
          <Button
            label="Continue lesson"
            variant="track-english"
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
          />
        </>
      ) : (
        <Text style={styles.body}>No lessons available yet.</Text>
      )}
    </Card>
  );
}

function ParentingCard({ dashboard }: { dashboard: TrackDashboard }) {
  const { course, lessons, nextLesson, completedCount } = dashboard;
  const total = lessons.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <Card variant="parenting-accent">
      <View style={styles.cardTopRow}>
        <View style={[styles.flameChip, { backgroundColor: colors.parentingTint }]}>
          <Text style={[styles.flameEmoji, { color: colors.parenting }]}>▶</Text>
        </View>
        <Text style={styles.h3}>{course.title}</Text>
        <View style={{ flex: 1 }} />
        <Text style={[styles.trackPill, { color: colors.parenting, backgroundColor: colors.parentingTint }]}>
          PARENTING
        </Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.label}>Course progress</Text>
          <Text style={styles.caption}>{pct}% complete</Text>
        </View>
        <LinearProgress progress={total > 0 ? completedCount / total : 0} color={colors.parenting} height={8} />
      </View>

      <View style={styles.divider} />

      {nextLesson ? (
        <>
          <View style={{ gap: 2 }}>
            <Text style={styles.caption}>Next up</Text>
            <Text style={styles.h3}>
              {nextLesson.position}.{" "}
              {"video" in nextLesson.content ? nextLesson.content.video.title : "Lesson"}
            </Text>
            <Text style={styles.caption}>
              {"video" in nextLesson.content && nextLesson.content.video.duration_seconds
                ? `${Math.round(nextLesson.content.video.duration_seconds / 60)} min video + quiz`
                : "Video + quiz"}
            </Text>
          </View>
          <Button
            label="Continue"
            variant="track-parenting"
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
          />
        </>
      ) : (
        <Text style={styles.body}>No lessons available yet.</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing[5], gap: spacing[6], paddingBottom: spacing[12] },
  centered: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  caption: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "500" },
  h2: { fontSize: type.h2.fontSize, fontWeight: "700", color: colors.ink },
  h3: { fontSize: type.h3.fontSize, fontWeight: "600", color: colors.ink },
  label: { fontSize: type.label.fontSize, fontWeight: "600", color: colors.ink },
  body: { fontSize: type.body.fontSize, color: colors.ink },
  subtitle: { fontSize: type.body.fontSize, color: colors.muted, textAlign: "center" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.mist,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: type.label.fontSize, fontWeight: "700", color: colors.ink },
  cardTopRow: { flexDirection: "row", alignItems: "center", gap: spacing[3] },
  flameChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.englishTint,
    alignItems: "center",
    justifyContent: "center",
  },
  flameEmoji: { fontSize: 18, color: colors.english },
  trackPill: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: 999,
    textTransform: "uppercase",
  },
  progressBlock: { gap: spacing[2] },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  divider: { height: 1, backgroundColor: colors.mist },
});
