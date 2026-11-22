# Lesson content shapes

Owner: `content-structurer` (Pandu). Defines the `jsonb` shape stored in `lessons.content` for each `lessons.kind`. The column itself (type, default `'{}'::jsonb`) is owned by `backend-architect` — this doc only governs what's *inside* it. `mobile-web-builder` (Wira) should render against these shapes exactly; any change to them needs a new migration plus an update to this doc.

Both shapes are versioned implicitly by `lessons.kind`: a `drill` row always has the drill shape, a `video_quiz` row always has the video_quiz shape. There is no `schema_version` field for MVP — if the shape changes incompatibly post-MVP, add one then.

## `kind = 'drill'` (English track)

Gamified, bite-sized. XP-based, no hearts/lives/streak-blocking in MVP — the lesson simply completes and awards XP; streak logic lives in `lesson_progress`/profile aggregation, not in this content blob.

```jsonc
{
  "xp_reward": 10,                // int, XP awarded on lesson completion
  "exercises": [
    // type = "mcq" — multiple choice
    {
      "type": "mcq",
      "prompt": "How do you say 'hello' formally?",
      "options": ["Hi", "Hello", "Yo", "Sup"],
      "correct_answer": "Hello"    // must be one of `options`, exact string match
    },

    // type = "fill_blank" — fill in the blank
    {
      "type": "fill_blank",
      "prompt": "I ___ a student.",
      "correct_answer": "am"       // case-insensitive, trimmed match on client
    },

    // type = "match_pairs" — match left items to right items
    {
      "type": "match_pairs",
      "prompt": "Match the English word to its meaning.",
      "pairs": [
        { "left": "Good morning", "right": "Greeting used before noon" },
        { "left": "Good night",   "right": "Said before sleeping" }
      ]
      // no separate correct_answer — each pair's left/right is itself the answer key
    }
  ]
}
```

### Field notes

- `xp_reward`: flat int per lesson (not per-exercise) for MVP simplicity.
- `exercises`: ordered array, rendered in order. Each exercise object's shape depends on `type`:
  - `mcq`: `prompt` (string), `options` (array of 2-5 strings), `correct_answer` (string, must exactly equal one entry in `options`).
  - `fill_blank`: `prompt` (string, must contain `___` as the blank marker), `correct_answer` (string; client should trim + lowercase-compare to be forgiving).
  - `match_pairs`: `prompt` (string, instruction), `pairs` (array of `{left, right}` string pairs, 2-5 pairs). Correctness = client-side match of each left to its right.
- No partial credit / no retries-limit modeling here — MVP drill completion is binary (finish all exercises correctly, or not); front-end can allow unlimited retry per exercise.

## `kind = 'video_quiz'` (Parenting track)

Self-paced: one reference video, then a short multi-question quiz. Pass/fail only, no retry limit (user can retake as many times as they want — no state in this blob tracks attempts).

```jsonc
{
  "video": {
    "title": "Safe Sleep Basics",
    "url": "placeholder://videos/safe-sleep-basics.mp4",   // swap for real hosted URL later
    "duration_seconds": 240
  },
  "quiz": {
    "pass_threshold": 0.75,       // fraction correct required to "pass", e.g. 3/4
    "questions": [
      {
        "prompt": "What is the safest sleep position for a newborn?",
        "options": ["On their stomach", "On their back", "On their side", "Any position is fine"],
        "correct_answer": "On their back"
      }
      // ... more questions, same shape
    ]
  }
}
```

### Field notes

- `video.url`: a placeholder string (not a real hosted asset) for MVP — `Wira` should treat this as swappable data, not something to validate as a real URL today.
- `video.duration_seconds`: optional display hint (e.g. show a time estimate before playing); not load-bearing.
- `quiz.questions`: all MCQ for MVP (4 options each is the convention used in seed content, but not enforced — 2+ options are valid).
- `quiz.pass_threshold`: fraction (0–1) of questions that must be answered correctly to mark the lesson `completed` in `lesson_progress`. No retry-limit field — by design, per MVP brainstorm (no gating on repeat attempts).

## Lesson sequencing

Both tracks use the same mechanism: `lessons.position` is a 1-based integer, unique within a `course_id`, defining render/unlock order. For MVP there is no explicit lock/unlock logic encoded in content — the app can choose to gate lesson N+1 on lesson N's `lesson_progress.status = 'completed'`, or show all lessons open; that's an app-layer (Wira) decision, not a content-shape concern. Seed data always assigns `position` starting at 1 and incrementing by 1 with no gaps.
