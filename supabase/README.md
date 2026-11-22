# belajaryuk — Supabase

**Status: live.** Project `belajaryuk` (ref `tsjycrcanmxjkowyovvm`, region `ap-southeast-1`) is provisioned under the "Business" org. `0001_init.sql`, `0002_profiles_track_interest.sql`, `0003_rls_policies.sql`, and `0004_seed_content.sql` are all applied — all 5 tables exist, `tracks` is seeded with `english` and `parenting`, RLS policies are in place, and both tracks have real seed content (see below).

- URL + publishable key are in `app/.env.example` — copy to `app/.env` to run the app against this project.
- Client: `app/lib/supabase.ts`.
- Future migrations: write a new numbered file in `migrations/` and apply it via the Supabase MCP tools or `supabase db push` after `supabase link --project-ref tsjycrcanmxjkowyovvm`.

## Schema

- `profiles` — one row per authenticated user (`auth.users`). `track_interest` (`text`, nullable, check-constrained to `'english' | 'parenting' | 'both'`) captures the track-interest selector shown at signup.
- `tracks` — the two content tracks: `english`, `parenting` (seeded).
- `courses` — belongs to a track.
- `lessons` — belongs to a course; `kind` distinguishes `drill` (English, gamified) vs `video_quiz` (Parenting); `content` is a `jsonb` blob whose shape is defined (per `kind`) in [`docs/content/lesson-content-shapes.md`](../docs/content/lesson-content-shapes.md), owned by the `content-structurer` subagent.
- `lesson_progress` — per-user, per-lesson completion state.

## RLS policies

RLS is enabled on all 5 tables. Policies (`0003_rls_policies.sql`):

- `profiles` — select/insert/update allowed only where `auth.uid() = id` (a user can only see/create/edit their own row). No delete policy.
- `lesson_progress` — select/insert/update allowed only where `auth.uid() = profile_id` (a user can only see/record their own progress). No delete policy.
- `tracks`, `courses`, `lessons` — public `select` (`using (true)`) for any authenticated or anon user, since this is public course-catalog content. No write policies — content is seeded/managed outside the app for MVP.

## Seed content (`0004_seed_content.sql`)

Real (non-placeholder) MVP content for both tracks, following the shapes in [`docs/content/lesson-content-shapes.md`](../docs/content/lesson-content-shapes.md):

- **English** — course "English Basics" (4 `drill` lessons: greetings & basic phrases, the verb "to be", present-tense verbs, simple sentences & questions). 22 exercises total, mixing `mcq`, `fill_blank`, and `match_pairs` types.
- **Parenting** — course "Newborn Essentials" (3 `video_quiz` lessons: safe sleep, feeding basics, soothing a crying baby). Each lesson has a placeholder video reference (`placeholder://videos/...`) and 4 MCQ quiz questions, 12 questions total.
