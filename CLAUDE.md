# belajaryuk

A consumer learning platform (MVP) with two content tracks:
- **English learning** — gamified, bite-sized lessons with streaks (Duolingo-style).
- **Parenting** — self-paced video lessons + quizzes.

Full design rationale: `docs/superpowers/specs/2026-11-22-belajaryuk-mvp-design.md`.

## Stack

- **App:** Expo (React Native + TypeScript) in `app/` — targets web, iOS, and Android from one codebase. `react-native-web` + `react-dom` are installed for web support. Run with `cd app && npx expo start`.
- **Backend:** Supabase (Postgres, Auth, Storage). Schema lives in `supabase/migrations/0001_init.sql` as SQL files only — **no live Supabase project is connected yet** (creation was blocked by a billing-safety check during initial scaffolding; provisioning the real project is an open task).
- **Deployment:** a Vercel project named `belajaryuk` exists and is linked to this GitHub repo, for hosting the Expo web export once there's something to deploy.

## Repo layout

- `app/` — the Expo app.
- `supabase/` — schema migrations + notes (`supabase/README.md`).
- `.claude/agents/` — four specialized subagents for this project:
  - `ui-ux-designer` — screens, flows, design system.
  - `backend-architect` — Supabase schema, auth, RLS, storage.
  - `mobile-web-builder` — Expo app implementation.
  - `content-structurer` — lesson content modeling per track.
- `docs/superpowers/specs/` — design docs. `docs/superpowers/plans/` — implementation plans.

## Working here

This project is built by dispatching work to the subagents above rather than doing everything in one undifferentiated pass — each has a narrow, non-overlapping scope (see their own files for exact boundaries). When picking up a new task, match it to the agent whose scope covers it; if a task spans more than one agent's scope, split it rather than letting one agent reach into another's area.
