import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Button } from "@/components/Button";
import { OptionTile } from "@/components/lesson/OptionTile";
import { SegmentedProgress } from "@/components/lesson/SegmentedProgress";
import type { DrillContent, DrillExercise, MatchPair } from "@/lib/types";
import { colors, radius, spacing, type } from "@/lib/theme";

type DrillPlayerProps = {
  content: DrillContent;
  xpStreak: number;
  onComplete: (result: { correctCount: number; totalCount: number; elapsedSeconds: number }) => void;
  onExit: () => void;
};

/**
 * Renders content.exercises one at a time (mcq / fill_blank / match_pairs),
 * matching the English-MC / English-Fill / English-Match mockups. Binary
 * completion per the content-shape doc: a wrong answer shows feedback and
 * lets the learner retry the same exercise — there's no retry limit and no
 * partial credit, so the lesson only advances once every exercise has been
 * answered correctly.
 */
export function DrillPlayer({ content, xpStreak, onComplete, onExit }: DrillPlayerProps) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  // Date.now() is impure, so it's recorded in an effect on mount rather
  // than during render (react-hooks/purity).
  const startedAt = useRef<number | null>(null);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const exercise = content.exercises[index];

  function handleExerciseCorrect() {
    setCorrectCount((c) => c + 1);
    if (index + 1 >= content.exercises.length) {
      onComplete({
        correctCount: correctCount + 1,
        totalCount: content.exercises.length,
        elapsedSeconds: Math.round((Date.now() - (startedAt.current ?? Date.now())) / 1000),
      });
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <View style={styles.flex}>
      <View style={styles.topBar}>
        <Pressable onPress={onExit} accessibilityRole="button" accessibilityLabel="Exit lesson" style={styles.iconButton}>
          <Text style={styles.iconGlyph}>✕</Text>
        </Pressable>
        <SegmentedProgress total={content.exercises.length} activeIndex={index} />
        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakCount}>{xpStreak}</Text>
        </View>
      </View>

      <ExerciseView key={index} exercise={exercise} onCorrect={handleExerciseCorrect} />
    </View>
  );
}

function ExerciseView({ exercise, onCorrect }: { exercise: DrillExercise; onCorrect: () => void }) {
  switch (exercise.type) {
    case "mcq":
      return <McqExerciseView exercise={exercise} onCorrect={onCorrect} />;
    case "fill_blank":
      return <FillBlankExerciseView exercise={exercise} onCorrect={onCorrect} />;
    case "match_pairs":
      return <MatchPairsExerciseView exercise={exercise} onCorrect={onCorrect} />;
  }
}

function McqExerciseView({
  exercise,
  onCorrect,
}: {
  exercise: Extract<DrillExercise, { type: "mcq" }>;
  onCorrect: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const isCorrect = selected !== null && selected === exercise.correct_answer;
  const isWrong = selected !== null && !isCorrect;

  return (
    <View style={styles.body}>
      <View style={styles.promptBlock}>
        <Text style={styles.eyebrow}>MULTIPLE CHOICE</Text>
        <Text style={styles.h2}>{exercise.prompt}</Text>
      </View>

      <View style={styles.optionsList}>
        {exercise.options.map((option) => {
          let state: "default" | "selected" | "correct" | "incorrect" = "default";
          if (selected === option) state = isCorrect ? "correct" : "incorrect";
          return (
            <OptionTile
              key={option}
              label={option}
              state={state}
              onPress={() => setSelected(option)}
              disabled={isCorrect}
            />
          );
        })}
      </View>

      {selected !== null && (
        <FeedbackBanner
          correct={isCorrect}
          correctMessage="Correct!"
          incorrectMessage="Not quite — try again."
          onContinue={isCorrect ? onCorrect : undefined}
          onRetry={isWrong ? () => setSelected(null) : undefined}
        />
      )}
    </View>
  );
}

function FillBlankExerciseView({
  exercise,
  onCorrect,
}: {
  exercise: Extract<DrillExercise, { type: "fill_blank" }>;
  onCorrect: () => void;
}) {
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);

  function check() {
    const isCorrect = value.trim().toLowerCase() === exercise.correct_answer.trim().toLowerCase();
    setChecked(isCorrect);
  }

  const [before, after] = exercise.prompt.split("___");

  return (
    <View style={styles.body}>
      <View style={styles.promptBlock}>
        <Text style={styles.eyebrow}>FILL IN THE BLANK</Text>
        <Text style={styles.h2}>Complete the sentence</Text>
      </View>

      <View style={styles.sentenceCard}>
        <Text style={styles.sentenceText}>
          {before}
          <Text style={{ fontWeight: "700", color: colors.english }}>
            {checked === true ? exercise.correct_answer : value || "___"}
          </Text>
          {after}
        </Text>
      </View>

      <TextInput
        value={value}
        onChangeText={(t) => {
          setValue(t);
          setChecked(null);
        }}
        placeholder="Type the missing word"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        editable={checked !== true}
        style={styles.textInput}
      />

      {checked === null ? (
        <Button label="Check" variant="track-english" onPress={check} disabled={!value.trim()} />
      ) : (
        <FeedbackBanner
          correct={checked}
          correctMessage="Correct!"
          incorrectMessage={`Not quite — the answer is "${exercise.correct_answer}".`}
          onContinue={checked ? onCorrect : undefined}
          onRetry={!checked ? () => setChecked(null) : undefined}
        />
      )}
    </View>
  );
}

function MatchPairsExerciseView({
  exercise,
  onCorrect,
}: {
  exercise: Extract<DrillExercise, { type: "match_pairs" }>;
  onCorrect: () => void;
}) {
  const rightShuffled = useMemo(() => shuffle(exercise.pairs.map((p) => p.right)), [exercise]);
  const [matchedLefts, setMatchedLefts] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const allMatched = matchedLefts.size === exercise.pairs.length;

  function rightOf(left: string): string | undefined {
    return exercise.pairs.find((p) => p.left === left)?.right;
  }

  function handlePickRight(right: string) {
    if (!selectedLeft) return;
    const expected = rightOf(selectedLeft);
    if (expected === right) {
      setMatchedLefts((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setSelectedRight(right);
      setWrongFlash(right);
      setTimeout(() => {
        setWrongFlash(null);
        setSelectedRight(null);
        setSelectedLeft(null);
      }, 500);
    }
  }

  return (
    <View style={styles.body}>
      <View style={styles.promptBlock}>
        <Text style={styles.eyebrow}>MATCH THE PAIRS</Text>
        <Text style={styles.h2}>{exercise.prompt}</Text>
      </View>

      <View style={styles.matchRow}>
        <View style={styles.matchColumn}>
          {exercise.pairs.map((pair: MatchPair) => (
            <OptionTile
              key={pair.left}
              label={pair.left}
              variant="tile"
              state={matchedLefts.has(pair.left) ? "matched" : selectedLeft === pair.left ? "selected" : "default"}
              onPress={() => !matchedLefts.has(pair.left) && setSelectedLeft(pair.left)}
              disabled={matchedLefts.has(pair.left)}
              accentColor={colors.brand}
              accentTint="#EEEBFD"
            />
          ))}
        </View>
        <View style={styles.matchColumn}>
          {rightShuffled.map((right) => {
            const isMatched = exercise.pairs.some((p) => p.right === right && matchedLefts.has(p.left));
            return (
              <OptionTile
                key={right}
                label={right}
                variant="tile"
                state={
                  isMatched
                    ? "matched"
                    : wrongFlash === right
                      ? "incorrect"
                      : selectedRight === right
                        ? "selected"
                        : "default"
                }
                onPress={() => !isMatched && handlePickRight(right)}
                disabled={isMatched || !selectedLeft}
                accentColor={colors.brand}
                accentTint="#EEEBFD"
              />
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1 }} />
      <Button label="Continue" variant="track-english" onPress={onCorrect} disabled={!allMatched} />
    </View>
  );
}

function FeedbackBanner({
  correct,
  correctMessage,
  incorrectMessage,
  onContinue,
  onRetry,
}: {
  correct: boolean;
  correctMessage: string;
  incorrectMessage: string;
  onContinue?: () => void;
  onRetry?: () => void;
}) {
  return (
    <View style={[styles.feedbackBanner, { backgroundColor: correct ? colors.englishTint : "#FBEAEA" }]}>
      <Text style={styles.feedbackTitle}>{correct ? correctMessage : "Not quite"}</Text>
      {!correct && <Text style={styles.feedbackCaption}>{incorrectMessage}</Text>}
      {onContinue && <Button label="Continue" variant="track-english" onPress={onContinue} />}
      {onRetry && <Button label="Try again" variant="track-english" onPress={onRetry} />}
    </View>
  );
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.paper },
  topBar: { flexDirection: "row", alignItems: "center", gap: spacing[3], padding: spacing[5], paddingBottom: spacing[3] },
  iconButton: { width: 36, height: 36, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  iconGlyph: { fontSize: 16, color: colors.muted },
  streakPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  streakEmoji: { fontSize: 16 },
  streakCount: { fontSize: type.label.fontSize, fontWeight: "700", color: colors.english },
  body: { flex: 1, padding: spacing[5], gap: spacing[6] },
  promptBlock: { gap: spacing[2] },
  eyebrow: { fontSize: type.caption.fontSize, color: colors.muted, fontWeight: "500" },
  h2: { fontSize: type.h2.fontSize, fontWeight: "700", color: colors.ink },
  optionsList: { gap: spacing[3] },
  sentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing[5],
  },
  sentenceText: { fontSize: type.bodyLg.fontSize, lineHeight: type.bodyLg.lineHeight, color: colors.ink },
  textInput: {
    height: 48,
    paddingHorizontal: spacing[3],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.mist,
    backgroundColor: colors.surface,
    color: colors.ink,
    fontSize: type.body.fontSize,
  },
  matchRow: { flexDirection: "row", gap: spacing[4] },
  matchColumn: { flex: 1, gap: spacing[3] },
  feedbackBanner: { borderRadius: radius.lg, padding: spacing[5], gap: spacing[3] },
  feedbackTitle: { fontSize: type.bodyMedium.fontSize, fontWeight: "700", color: colors.ink },
  feedbackCaption: { fontSize: type.caption.fontSize, color: colors.muted },
});
