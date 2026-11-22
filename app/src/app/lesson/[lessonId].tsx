import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { DrillPlayer } from "@/components/lesson/DrillPlayer";
import { VideoQuizPlayer } from "@/components/lesson/VideoQuizPlayer";
import { XPPanel } from "@/components/lesson/XPPanel";
import {
  fetchEnglishStreak,
  fetchLessonById,
  markLessonCompleted,
} from "@/lib/lessons";
import type { DrillContent, Lesson, VideoQuizContent } from "@/lib/types";
import { colors, spacing, type } from "@/lib/theme";
import { useSession } from "@/lib/useSession";

type ViewState =
  | { stage: "loading" }
  | { stage: "error"; message: string }
  | { stage: "drill"; lesson: Lesson; streak: number }
  | { stage: "drill-complete"; result: { correctCount: number; totalCount: number; elapsedSeconds: number }; xpReward: number; newStreak: number }
  | { stage: "video_quiz"; lesson: Lesson };

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { session, loading: sessionLoading } = useSession();
  const [view, setView] = useState<ViewState>({ stage: "loading" });

  // Canonical "fetch on mount" effect shape (react.dev data-fetching
  // guide): the async work and its setState calls live inside the effect
  // itself, guarded by an `ignore` flag, rather than a named callback —
  // keeps react-hooks/set-state-in-effect happy.
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.replace("/login");
      return;
    }
    const userId = session?.user.id;
    if (!userId || !lessonId) return;

    let ignore = false;
    fetchLessonById(lessonId).then(async (lesson) => {
      if (ignore) return;
      if (!lesson) {
        setView({ stage: "error", message: "We couldn't find that lesson." });
        return;
      }
      if (lesson.kind === "drill") {
        const streak = await fetchEnglishStreak(userId);
        if (!ignore) setView({ stage: "drill", lesson, streak });
      } else {
        setView({ stage: "video_quiz", lesson });
      }
    });
    return () => {
      ignore = true;
    };
  }, [session, sessionLoading, lessonId]);

  if (view.stage === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand} />
      </View>
    );
  }

  if (view.stage === "error") {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>{view.message}</Text>
        <View style={{ width: 160, marginTop: spacing[4] }}>
          <Button label="Back to home" onPress={() => router.replace("/home")} />
        </View>
      </View>
    );
  }

  if (view.stage === "drill") {
    const content = view.lesson.content as DrillContent;
    return (
      <DrillPlayer
        content={content}
        xpStreak={view.streak}
        onExit={() => router.replace("/home")}
        onComplete={async (result) => {
          if (session?.user.id) {
            await markLessonCompleted(session.user.id, view.lesson.id);
            const newStreak = await fetchEnglishStreak(session.user.id);
            setView({ stage: "drill-complete", result, xpReward: content.xp_reward, newStreak });
          }
        }}
      />
    );
  }

  if (view.stage === "drill-complete") {
    const minutes = Math.floor(view.result.elapsedSeconds / 60);
    const seconds = view.result.elapsedSeconds % 60;
    return (
      <View style={styles.completeBody}>
        <View style={styles.trophyCircle}>
          <Text style={{ fontSize: 36, color: colors.english }}>★</Text>
        </View>
        <View style={{ alignItems: "center", gap: spacing[1] }}>
          <Text style={styles.h1}>Lesson complete!</Text>
        </View>

        <XPPanel
          xpEarned={view.xpReward}
          correctCount={view.result.correctCount}
          totalCount={view.result.totalCount}
        />
        <Text style={styles.caption}>
          Time: {minutes}:{String(seconds).padStart(2, "0")}
        </Text>

        <View style={styles.streakBanner}>
          <Text style={{ fontSize: 24 }}>🔥</Text>
          <View>
            <Text style={styles.streakBannerTitle}>{view.newStreak}-day streak maintained</Text>
            <Text style={styles.streakBannerCaption}>Come back tomorrow to keep it going.</Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Back to home" variant="track-english" onPress={() => router.replace("/home")} />
      </View>
    );
  }

  // stage === "video_quiz"
  const content = view.lesson.content as VideoQuizContent;
  return (
    <VideoQuizPlayer
      lessonTitle={content.video.title}
      content={content}
      onExit={() => router.replace("/home")}
      onFinish={async () => {
        // No retry limit / no pass-fail column on lesson_progress — any
        // completed attempt (pass or fail) marks the lesson 'completed',
        // per the content-shape doc and this pass's brief.
        if (session?.user.id) {
          await markLessonCompleted(session.user.id, view.lesson.id);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing[6],
  },
  subtitle: { fontSize: type.body.fontSize, color: colors.muted, textAlign: "center" },
  completeBody: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    padding: spacing[6],
    paddingTop: spacing[12],
    gap: spacing[5],
  },
  h1: { fontSize: type.h1.fontSize, fontWeight: "700", color: colors.ink },
  caption: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "500" },
  trophyCircle: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: colors.englishTint,
    alignItems: "center",
    justifyContent: "center",
  },
  streakBanner: {
    width: "100%",
    backgroundColor: colors.ink,
    borderRadius: 16,
    padding: spacing[5],
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  streakBannerTitle: { color: colors.surface, fontWeight: "700", fontSize: type.body.fontSize },
  streakBannerCaption: { color: "#C9C2D6", fontSize: type.caption.fontSize, fontWeight: "500" },
});
