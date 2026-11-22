import { supabase } from "@/lib/supabase";
import { computeCurrentStreak } from "@/lib/streak";
import type {
  Course,
  DrillContent,
  Lesson,
  LessonProgress,
  Profile,
  Track,
  VideoQuizContent,
} from "@/lib/types";

export type TrackDashboard = {
  track: Track;
  course: Course;
  lessons: Lesson[];
  progressByLessonId: Map<string, LessonProgress>;
  /** First lesson (by position) that isn't completed yet; falls back to the last lesson if the whole course is done. */
  nextLesson: Lesson | null;
  completedCount: number;
};

export type DashboardData = {
  profile: Profile | null;
  english: TrackDashboard | null;
  parenting: TrackDashboard | null;
  englishStreak: number;
};

async function loadTrackDashboard(
  slug: "english" | "parenting",
  profileId: string
): Promise<TrackDashboard | null> {
  const { data: track, error: trackError } = await supabase
    .from("tracks")
    .select("id, slug, name")
    .eq("slug", slug)
    .maybeSingle();
  if (trackError || !track) return null;

  // MVP content model: one course per track (per supabase/README.md seed data).
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, track_id, title, description")
    .eq("track_id", track.id)
    .order("title", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (courseError || !course) return null;

  const { data: lessonRows, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, course_id, position, kind, content")
    .eq("course_id", course.id)
    .order("position", { ascending: true });
  if (lessonsError || !lessonRows) return null;
  const lessons = lessonRows as Lesson[];

  const lessonIds = lessons.map((l) => l.id);
  const progressByLessonId = new Map<string, LessonProgress>();
  if (lessonIds.length > 0) {
    const { data: progressRows } = await supabase
      .from("lesson_progress")
      .select("id, profile_id, lesson_id, status, completed_at")
      .eq("profile_id", profileId)
      .in("lesson_id", lessonIds);
    for (const row of progressRows ?? []) {
      progressByLessonId.set(row.lesson_id, row as LessonProgress);
    }
  }

  const completedCount = lessons.filter(
    (l) => progressByLessonId.get(l.id)?.status === "completed"
  ).length;

  const nextLesson =
    lessons.find((l) => progressByLessonId.get(l.id)?.status !== "completed") ??
    lessons[lessons.length - 1] ??
    null;

  return { track, course, lessons, progressByLessonId, nextLesson, completedCount };
}

export async function fetchDashboardData(profileId: string): Promise<DashboardData> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, track_interest, created_at")
    .eq("id", profileId)
    .maybeSingle();

  const trackInterest = profile?.track_interest ?? "both";
  const wantsEnglish = trackInterest === "english" || trackInterest === "both";
  const wantsParenting = trackInterest === "parenting" || trackInterest === "both";

  const [english, parenting] = await Promise.all([
    wantsEnglish ? loadTrackDashboard("english", profileId) : Promise.resolve(null),
    wantsParenting ? loadTrackDashboard("parenting", profileId) : Promise.resolve(null),
  ]);

  const englishStreak = english ? streakFromTrackDashboard(english) : 0;

  return { profile: (profile as Profile) ?? null, english, parenting, englishStreak };
}

// Streak is derived from ALL completed English lesson_progress rows (not
// just the current course's), per the streak-semantics brief.
function streakFromTrackDashboard(dashboard: TrackDashboard): number {
  const completedTimestamps = dashboard.lessons
    .map((l) => dashboard.progressByLessonId.get(l.id))
    .filter((p) => p?.status === "completed")
    .map((p) => p?.completed_at ?? null);
  return computeCurrentStreak(completedTimestamps);
}

/** Lightweight streak lookup for the lesson player top bar, without pulling the whole dashboard. */
export async function fetchEnglishStreak(profileId: string): Promise<number> {
  const english = await loadTrackDashboard("english", profileId);
  return english ? streakFromTrackDashboard(english) : 0;
}

export async function fetchLessonById(lessonId: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, course_id, position, kind, content")
    .eq("id", lessonId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Lesson;
}

export async function markLessonCompleted(profileId: string, lessonId: string): Promise<void> {
  await supabase.from("lesson_progress").upsert(
    {
      profile_id: profileId,
      lesson_id: lessonId,
      status: "completed",
      completed_at: new Date().toISOString(),
    },
    { onConflict: "profile_id,lesson_id" }
  );
}

export function isDrillContent(
  kind: Lesson["kind"],
  content: Lesson["content"]
): content is DrillContent {
  return kind === "drill";
}

export function isVideoQuizContent(
  kind: Lesson["kind"],
  content: Lesson["content"]
): content is VideoQuizContent {
  return kind === "video_quiz";
}
