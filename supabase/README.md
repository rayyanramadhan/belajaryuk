# belajaryuk — Supabase

**Status: live.** Project `belajaryuk` (ref `tsjycrcanmxjkowyovvm`, region `ap-southeast-1`) is provisioned under the "Business" org, and `0001_init.sql` is applied — all 5 tables exist, `tracks` is seeded with `english` and `parenting`.

- URL + publishable key are in `app/.env.example` — copy to `app/.env` to run the app against this project.
- Client: `app/lib/supabase.ts`.
- Future migrations: write a new numbered file in `migrations/` and apply it via the Supabase MCP tools or `supabase db push` after `supabase link --project-ref tsjycrcanmxjkowyovvm`.

## Schema

- `profiles` — one row per authenticated user (`auth.users`).
- `tracks` — the two content tracks: `english`, `parenting` (seeded).
- `courses` — belongs to a track.
- `lessons` — belongs to a course; `kind` distinguishes `drill` (English, gamified) vs `video_quiz` (Parenting); `content` is a free-form `jsonb` shape, designed in detail by the `content-structurer` subagent.
- `lesson_progress` — per-user, per-lesson completion state.

RLS is enabled on all 5 tables (Supabase default), but no policies are defined yet — that's `backend-architect`'s next task.
