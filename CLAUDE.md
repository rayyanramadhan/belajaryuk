# belajaryuk

A consumer learning platform (MVP) with two content tracks:
- **English learning** — gamified, bite-sized lessons with streaks (Duolingo-style).
- **Parenting** — self-paced video lessons + quizzes.

Full design rationale: `docs/superpowers/specs/2026-11-22-belajaryuk-mvp-design.md`.

## Stack

- **App:** Expo (React Native + TypeScript) in `app/` — targets web, iOS, and Android from one codebase. `react-native-web` + `react-dom` are installed for web support. Run with `cd app && npx expo start`.
- **Backend:** Supabase (Postgres, Auth, Storage) — **live**: project `belajaryuk` (ref `tsjycrcanmxjkowyovvm`, `ap-southeast-1`). Migrations `0001`-`0004` applied: core schema, `profiles.track_interest`, RLS policies (profiles/lesson_progress owner-scoped, tracks/courses/lessons public-read), and real seed content (English Basics: 4 drill lessons; Newborn Essentials: 3 video_quiz lessons — shape documented in `docs/content/lesson-content-shapes.md`). URL/key in `app/.env.example`, client in `app/lib/supabase.ts`.
- **Deployment:** Vercel project `belajaryuk` (team `rayyanramadhans-projects`), Git-connected to this repo; production URL https://belajaryuk-ten.vercel.app (behind Vercel Authentication until made public). Root dir `app`, static `npx expo export --platform web` → `dist`, SPA rewrite in `app/vercel.json`. `EXPO_PUBLIC_SUPABASE_*` env vars are set in the Vercel project.
- **Design:** Claude's native Design System + Design artifacts (not Figma — dropped after hitting Figma MCP's Starter-plan rate limit mid-build; free and unlimited within this ecosystem). `ui-ux-designer` ("Citra") builds a Design System artifact (tokens/components) and Design artifacts (screens) here; `mobile-web-builder` ("Wira") implements from those.
  - Design System artifact: "belajaryuk Design System" — slug `6b5c9ba9-3d50-48e2-9bff-176c31ee3c6c` (https://claude.ai/artifact/EFwBjLGUBjwKKtmhV1Y1zj). Colors, type (Plus Jakarta Sans), spacing, radius, Button/Input/Card components.
  - Design canvas: "belajaryuk — Marketing Site + Auth" — slug `5e6aa96f-f9ac-4794-80f2-52aeafc2e40c` (https://claude.ai/artifact/CfDmzg5ZLKEHP4gjTkiUT5). Artboards: Landing Page, Sign Up, Login (web), Home/Dashboard, English drill player (MCQ/fill-blank/match-pairs + completion), Parenting video+quiz player (+ pass/fail), all linked into a clickable flow.

## MVP status (as of 2026-11-22)

First MVP is built and pushed to `main`: Landing → Sign Up/Login → Dashboard (streak + next-lesson cards per track) → English drill lesson player (XP, streak) and Parenting video+quiz player (pass/fail), backed by live Supabase schema, RLS, and real seed content. Not yet done: a live end-to-end click-through test — this cloud sandbox's network proxy blocks `*.supabase.co` outright, so verification must happen on a machine with normal network access (`cd app && cp .env.example .env && npx expo start --web`). Known cosmetic gap: fill-in-the-blank renders as a text input rather than tappable word chips (the content shape has no distractor word bank for chips).

## Repo layout

- `app/` — the Expo app.
- `supabase/` — schema migrations + notes (`supabase/README.md`).
- `.claude/agents/` — four specialized subagents for this project:
  - `ui-ux-designer` ("Citra") — screens, flows, design system.
  - `backend-architect` ("Bagas") — Supabase schema, auth, RLS, storage.
  - `mobile-web-builder` ("Wira") — Expo app implementation.
  - `content-structurer` ("Pandu") — lesson content modeling per track.
- `docs/superpowers/specs/` — design docs. `docs/superpowers/plans/` — implementation plans.

## Working here

This project is built by dispatching work to the subagents above rather than doing everything in one undifferentiated pass — each has a narrow, non-overlapping scope (see their own files for exact boundaries). When picking up a new task, match it to the agent whose scope covers it; if a task spans more than one agent's scope, split it rather than letting one agent reach into another's area.

### Orchestrator ("Dirga")

There is a fifth role, but it is never one of the four dispatchable subagents above — it's whichever session is actually driving the work (this Claude Code session, or Antigravity once work moves to the user's local machine). Nicknamed **Dirga** ("from dirgantara, sky/overview"). Its job:

- Take an incoming task and decide which of the four agents (or which combination) it belongs to.
- Sequence dependent work — `mobile-web-builder` ("Wira") implements from what the other three produce, so it goes last on anything it depends on; `ui-ux-designer` ("Citra"), `backend-architect` ("Bagas"), and `content-structurer` ("Pandu") can usually run independently of each other.
- Keep agents from reaching into scope that isn't theirs (e.g. a design task quietly touching the schema).
- This role is not delegated to a subagent definition, because dispatching and sequencing the other four is the thing it does — there's nothing left to hand off.
