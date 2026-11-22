import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { LinearProgress } from "@/components/lesson/LinearProgress";
import { OptionTile } from "@/components/lesson/OptionTile";
import { VideoPlaceholder } from "@/components/lesson/VideoPlaceholder";
import type { VideoQuizContent } from "@/lib/types";
import { colors, radius, spacing, type } from "@/lib/theme";

type Stage = "video" | "quiz" | "result";

type VideoQuizPlayerProps = {
  lessonTitle: string;
  content: VideoQuizContent;
  onFinish: (result: { passed: boolean; correctCount: number; totalCount: number }) => void;
  onExit: () => void;
};

/**
 * Parenting-Video → Parenting-Quiz → Parenting-Result-Pass/Fail, as one
 * stateful flow. There's no real video playback in this MVP — "Mark as
 * watched" is a pragmatic stand-in for the placeholder video asset — and no
 * retry-limit gating, matching the content-shape doc.
 */
export function VideoQuizPlayer({ lessonTitle, content, onFinish, onExit }: VideoQuizPlayerProps) {
  const [stage, setStage] = useState<Stage>("video");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    () => content.quiz.questions.map(() => null)
  );
  const [lastResult, setLastResult] = useState<{ passed: boolean; correctCount: number } | null>(null);

  function startQuiz() {
    setQuestionIndex(0);
    setAnswers(content.quiz.questions.map(() => null));
    setStage("quiz");
  }

  function selectAnswer(answer: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = answer;
      return next;
    });
  }

  function nextQuestion() {
    if (questionIndex + 1 < content.quiz.questions.length) {
      setQuestionIndex((i) => i + 1);
      return;
    }
    const correctCount = content.quiz.questions.filter(
      (q, i) => answers[i] === q.correct_answer
    ).length;
    const passed = correctCount / content.quiz.questions.length >= content.quiz.pass_threshold;
    setLastResult({ passed, correctCount });
    setStage("result");
    onFinish({ passed, correctCount, totalCount: content.quiz.questions.length });
  }

  if (stage === "video") {
    return (
      <View style={styles.flex}>
        <TopBar title={lessonTitle} onBack={onExit} />
        <View style={styles.videoBody}>
          <VideoPlaceholder />
          <View style={{ gap: spacing[1] }}>
            <Text style={styles.h1}>{content.video.title}</Text>
            {content.video.duration_seconds ? (
              <Text style={styles.caption}>{Math.round(content.video.duration_seconds / 60)} min</Text>
            ) : null}
          </View>
          <Text style={styles.body}>
            Watch at your own pace, then take the short quiz below.
          </Text>
        </View>
        <View style={styles.footer}>
          <Button label="Mark as watched & take the quiz" variant="track-parenting" onPress={startQuiz} />
          <Text style={[styles.caption, { textAlign: "center" }]}>
            No real video playback yet — this stands in for watching it.
          </Text>
        </View>
      </View>
    );
  }

  if (stage === "quiz") {
    const question = content.quiz.questions[questionIndex];
    const selected = answers[questionIndex];
    return (
      <View style={styles.flex}>
        <View style={styles.quizTopBar}>
          <Pressable onPress={onExit} accessibilityRole="button" accessibilityLabel="Exit quiz" style={styles.iconButton}>
            <Text style={styles.iconGlyph}>✕</Text>
          </Pressable>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.caption}>
              Question {questionIndex + 1} of {content.quiz.questions.length}
            </Text>
            <LinearProgress
              progress={(questionIndex + 1) / content.quiz.questions.length}
              color={colors.parenting}
            />
          </View>
        </View>

        <View style={styles.body2}>
          <Text style={styles.h3}>{question.prompt}</Text>
          <View style={{ gap: spacing[3] }}>
            {question.options.map((option) => (
              <OptionTile
                key={option}
                label={option}
                variant="quiz"
                state={selected === option ? "selected" : "default"}
                onPress={() => selectAnswer(option)}
                accentColor={colors.parenting}
                accentTint={colors.parentingTint}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label={questionIndex + 1 < content.quiz.questions.length ? "Next question" : "See results"}
            variant="track-parenting"
            onPress={nextQuestion}
            disabled={selected === null}
          />
        </View>
      </View>
    );
  }

  // stage === "result"
  if (!lastResult) return null;
  const total = content.quiz.questions.length;
  return (
    <View style={[styles.flex, styles.resultBody]}>
      <View
        style={[
          styles.resultIconCircle,
          { backgroundColor: lastResult.passed ? colors.parentingTint : colors.mist },
        ]}
      >
        <Text style={{ fontSize: 32, color: lastResult.passed ? colors.parenting : colors.ink }}>
          {lastResult.passed ? "✓" : "↻"}
        </Text>
      </View>
      <View style={{ alignItems: "center", gap: spacing[2] }}>
        <Text style={styles.h1}>{lastResult.passed ? "Nice work!" : "Let's try that again"}</Text>
        <View style={styles.resultCard}>
          <Text style={[styles.body, { textAlign: "center" }]}>
            You got <Text style={{ fontWeight: "700" }}>{lastResult.correctCount} out of {total}</Text>
            {lastResult.passed
              ? ` right. "${lessonTitle}" is marked complete.`
              : " — no worries, rewatch the video whenever you like and retake the quiz. There's no limit on attempts."}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ width: "100%", gap: spacing[3] }}>
        {lastResult.passed ? (
          <>
            <Button label="Back to home" variant="track-parenting" onPress={onExit} />
            <Button label="Review the video" variant="secondary" onPress={() => setStage("video")} />
          </>
        ) : (
          <>
            <Button label="Retake the quiz" variant="track-parenting" onPress={startQuiz} />
            <Button label="Rewatch the video" variant="secondary" onPress={() => setStage("video")} />
          </>
        )}
      </View>
    </View>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back to home" style={styles.iconButton}>
        <Text style={styles.iconGlyph}>✕</Text>
      </Pressable>
      <Text style={styles.caption}>{title.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  topBar: { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[5], paddingBottom: spacing[2] },
  quizTopBar: { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[5], paddingBottom: spacing[2] },
  iconButton: { width: 36, height: 36, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  iconGlyph: { fontSize: 16, color: colors.muted },
  videoBody: { padding: spacing[5], gap: spacing[5], flex: 1 },
  body2: { padding: spacing[5], gap: spacing[5], flex: 1 },
  footer: { padding: spacing[5], gap: spacing[3] },
  h1: { fontSize: type.h1.fontSize, fontWeight: "700", color: colors.ink },
  h3: { fontSize: type.h3.fontSize, fontWeight: "600", color: colors.ink, lineHeight: type.h3.lineHeight + 4 },
  caption: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "500" },
  body: { fontSize: type.body.fontSize, color: colors.ink, lineHeight: type.body.lineHeight },
  resultBody: { alignItems: "center", padding: spacing[6], paddingTop: spacing[16], gap: spacing[6] },
  resultIconCircle: { width: 88, height: 88, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  resultCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[5],
    marginTop: spacing[2],
  },
});
