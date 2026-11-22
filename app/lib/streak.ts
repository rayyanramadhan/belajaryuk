/**
 * English-track streak computation (derived client-side, no schema change).
 *
 * Input: the `completed_at` timestamps of the signed-in user's completed
 * `lesson_progress` rows for English-track lessons. Output: the current
 * consecutive-day streak, using standard "still alive until today ends"
 * semantics — a streak completed yesterday still counts as current today;
 * it only breaks once a full day passes with nothing completed.
 */

function toLocalDateKey(date: Date): string {
  // Local calendar day, not UTC — a lesson finished at 11pm shouldn't roll
  // into "tomorrow" for someone a few hours further east.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

export function computeCurrentStreak(
  completedAtTimestamps: (string | null)[],
  now: Date = new Date()
): number {
  const distinctDates = new Set(
    completedAtTimestamps
      .filter((value): value is string => Boolean(value))
      .map((value) => toLocalDateKey(new Date(value)))
  );

  if (distinctDates.size === 0) return 0;

  const today = toLocalDateKey(now);
  const yesterday = toLocalDateKey(addDays(now, -1));

  // If nothing was completed today or yesterday, the streak has lapsed.
  let cursor: Date;
  if (distinctDates.has(today)) {
    cursor = now;
  } else if (distinctDates.has(yesterday)) {
    cursor = addDays(now, -1);
  } else {
    return 0;
  }

  let streak = 0;
  while (distinctDates.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
