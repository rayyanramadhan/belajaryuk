/**
 * Shared data types for the dashboard + lesson players. Mirrors the schema
 * in supabase/migrations and the content shapes in
 * docs/content/lesson-content-shapes.md (owned by Pandu — render against
 * these exactly, don't invent fields).
 */

export type TrackSlug = "english" | "parenting";

export type TrackInterest = "english" | "parenting" | "both";

export type LessonKind = "drill" | "video_quiz";

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export type Profile = {
  id: string;
  display_name: string | null;
  track_interest: TrackInterest | null;
  created_at: string;
};

export type Track = {
  id: string;
  slug: TrackSlug;
  name: string;
};

export type Course = {
  id: string;
  track_id: string;
  title: string;
  description: string | null;
};

// ---- lessons.content shapes (kind = 'drill') ----

export type McqExercise = {
  type: "mcq";
  prompt: string;
  options: string[];
  correct_answer: string;
};

export type FillBlankExercise = {
  type: "fill_blank";
  prompt: string;
  correct_answer: string;
};

export type MatchPair = { left: string; right: string };

export type MatchPairsExercise = {
  type: "match_pairs";
  prompt: string;
  pairs: MatchPair[];
};

export type DrillExercise = McqExercise | FillBlankExercise | MatchPairsExercise;

export type DrillContent = {
  xp_reward: number;
  exercises: DrillExercise[];
};

// ---- lessons.content shape (kind = 'video_quiz') ----

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correct_answer: string;
};

export type VideoQuizContent = {
  video: {
    title: string;
    url: string;
    duration_seconds?: number;
  };
  quiz: {
    pass_threshold: number;
    questions: QuizQuestion[];
  };
};

export type Lesson = {
  id: string;
  course_id: string;
  position: number;
  kind: LessonKind;
  content: DrillContent | VideoQuizContent;
};

export type LessonProgress = {
  id: string;
  profile_id: string;
  lesson_id: string;
  status: LessonProgressStatus;
  completed_at: string | null;
};
