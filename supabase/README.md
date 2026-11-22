# belajaryuk — Supabase

**Status: schema-only.** No live Supabase project is wired up yet (project creation was blocked here for billing-safety reasons — see the main README / chat history). Once a project exists:

1. Install the Supabase CLI locally (`npm install -g supabase`), or use the Supabase MCP tools.
2. Run `supabase link --project-ref <ref>`.
3. Run `supabase db push` to apply `migrations/0001_init.sql`.
4. Copy the project's URL and anon/publishable key into `app/.env` (see `app/.env.example` once `backend-architect` wires up the client).

## Schema

- `profiles` — one row per authenticated user (`auth.users`).
- `tracks` — the two content tracks: `english`, `parenting` (seeded).
- `courses` — belongs to a track.
- `lessons` — belongs to a course; `kind` distinguishes `drill` (English, gamified) vs `video_quiz` (Parenting); `content` is a free-form `jsonb` shape, designed in detail by the `content-structurer` subagent.
- `lesson_progress` — per-user, per-lesson completion state.

RLS policies are not yet defined — that's `backend-architect`'s next task once a live project exists.
