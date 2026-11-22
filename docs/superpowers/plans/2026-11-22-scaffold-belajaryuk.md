# belajaryuk Scaffolding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the belajaryuk repo skeleton — Expo app, Supabase schema files, and four specialized `.claude/agents/` subagent definitions — so any agent (this session, Antigravity, etc.) can pick up concrete feature work next.

**Architecture:** One Expo (React Native) app targeting web + iOS + Android; Supabase (Postgres) schema defined as SQL migration files, no live project wired yet; subagent personas defined as markdown files Claude Code loads via its Agent tool.

**Tech Stack:** Expo (React Native + Expo Web), TypeScript, Supabase (Postgres/Auth/Storage, schema-only for now).

**Spec:** `docs/superpowers/specs/2026-11-22-belajaryuk-mvp-design.md`

## Global Constraints

- Private repo `rayyanramadhan/belajaryuk`; all commits pushed to `main`.
- No live Supabase credentials in this phase — schema as SQL files only.
- No payment, scheduling, admin-CMS, or analytics code in this phase (non-goals).
- Agent definitions must have genuinely distinct, non-overlapping scopes (anti-goal: fake separation of concerns).

## Review Focus

- A later contributor cloning the repo with no context runs `npm install && npx expo start` and it should not error immediately for a missing config.
- The Supabase schema file should be valid, runnable SQL (idempotent — `CREATE TABLE IF NOT EXISTS`) even though no project exists yet to run it against.
- Each `.claude/agents/*.md` file must declare a scope narrow enough that two agents wouldn't both claim the same task (e.g. "database schema" is `backend-architect`'s, not `content-structurer`'s).
- `CLAUDE.md` at repo root must be self-contained — a fresh agent (Antigravity or otherwise) with zero chat history must be able to read it and know the stack, the tracks, and where things live.
- `.gitignore` must exclude `node_modules/` and any future `.env` before the first real dependency install, or a careless `git add .` later balloons the repo.

---

### Task 1: Expo app skeleton

**Files:**
- Create: `app/` (via `npx create-expo-app@latest app --template blank-typescript`)
- Create: `.gitignore` (root)
- Test: manual verification (no unit tests for scaffolding)

**Interfaces:**
- Produces: a runnable Expo project at `app/` that `mobile-web-builder` extends with real screens.

- [ ] **Step 1: Scaffold the Expo project**

Run: `cd /home/claude/belajaryuk && npx --yes create-expo-app@latest app --template blank-typescript`

- [ ] **Step 2: Add web support**

Run: `cd app && npx expo install react-native-web react-dom`

- [ ] **Step 3: Write root `.gitignore`**

Must exclude at minimum: `node_modules/`, `.expo/`, `.env`, `.env.*`, `dist/`, `*.log`.

- [ ] **Step 4: Verify the project is well-formed**

Run: `cd app && npx expo-doctor`
Expected: no fatal errors (warnings about not-yet-configured EAS project are fine).

- [ ] **Step 5: Commit**

```bash
git add app .gitignore
git commit -m "chore: scaffold Expo app (web + iOS + Android)"
```

---

### Task 2: Supabase schema skeleton

**Files:**
- Create: `supabase/migrations/0001_init.sql`
- Create: `supabase/README.md`

**Interfaces:**
- Consumes: track definitions from the spec (English: gamified lessons; Parenting: video + quiz).
- Produces: table names `profiles`, `tracks`, `courses`, `lessons`, `lesson_progress` for `backend-architect` and `content-structurer` to extend.

- [ ] **Step 1: Write `supabase/migrations/0001_init.sql`**

Minimum tables, each `CREATE TABLE IF NOT EXISTS`:
- `profiles` (id uuid pk references auth.users, display_name text, created_at timestamptz)
- `tracks` (id uuid pk, slug text unique — e.g. `'english'`, `'parenting'`, name text)
- `courses` (id uuid pk, track_id uuid references tracks, title text, description text)
- `lessons` (id uuid pk, course_id uuid references courses, position int, kind text — e.g. `'drill'` | `'video_quiz'`, content jsonb)
- `lesson_progress` (id uuid pk, profile_id uuid references profiles, lesson_id uuid references lessons, status text, completed_at timestamptz)

- [ ] **Step 2: Write `supabase/README.md`**

State plainly: no live Supabase project is wired yet; `backend-architect` runs this migration against a real project once credentials exist, via `supabase db push` or the SQL editor.

- [ ] **Step 3: Verify the SQL parses**

Run: `cat supabase/migrations/0001_init.sql | grep -c "CREATE TABLE"`
Expected: `5`

- [ ] **Step 4: Commit**

```bash
git add supabase
git commit -m "chore: add Supabase schema skeleton (no live project yet)"
```

---

### Task 3: Subagent definitions

**Files:**
- Create: `.claude/agents/ui-ux-designer.md`
- Create: `.claude/agents/backend-architect.md`
- Create: `.claude/agents/mobile-web-builder.md`
- Create: `.claude/agents/content-structurer.md`

**Interfaces:**
- Consumes: scope table from the spec.
- Produces: four subagents callable via the Agent tool by name (`ui-ux-designer`, `backend-architect`, `mobile-web-builder`, `content-structurer`).

- [ ] **Step 1: Write `ui-ux-designer.md`**

Frontmatter: `name: ui-ux-designer`, one-line `description` ("Use for screen design, UX flows, and the design system for both belajaryuk tracks"). Body: scope = screens/flows/design system; explicitly out of scope = backend schema, build code.

- [ ] **Step 2: Write `backend-architect.md`**

Frontmatter: `name: backend-architect`, `description` ("Use for Supabase schema, auth, RLS policies, and storage structure"). Body: scope = `supabase/` directory, schema/RLS/storage; out of scope = UI, app code.

- [ ] **Step 3: Write `mobile-web-builder.md`**

Frontmatter: `name: mobile-web-builder`, `description` ("Use for implementing Expo screens and app logic from a design"). Body: scope = `app/` directory; consumes designs from `ui-ux-designer` and schema from `backend-architect`; out of scope = schema design.

- [ ] **Step 4: Write `content-structurer.md`**

Frontmatter: `name: content-structurer`, `description` ("Use for modeling course/lesson/progress content specific to gamified-English vs. video-Parenting loops"). Body: scope = `lessons.content` jsonb shape per track, lesson sequencing; out of scope = schema DDL (that's `backend-architect`'s), UI.

- [ ] **Step 5: Verify each file has valid frontmatter**

Run: `for f in .claude/agents/*.md; do head -5 "$f"; echo "---"; done`
Expected: each file starts with `---`, has `name:` and `description:`, closes with `---`.

- [ ] **Step 6: Commit**

```bash
git add .claude/agents
git commit -m "chore: define ui-ux-designer, backend-architect, mobile-web-builder, content-structurer subagents"
```

---

### Task 4: Repo-root docs and push

**Files:**
- Create: `CLAUDE.md`
- Create: `README.md`

**Interfaces:**
- Consumes: everything from Tasks 1–3 (must describe what actually exists, not aspirational structure).

- [ ] **Step 1: Write `CLAUDE.md`**

Must state, self-contained (a fresh agent with no chat history reads only this): the product (belajaryuk — English learning + Parenting tracks, MVP), the stack (Expo web+mobile, Supabase schema-only), the four subagents and when to use each, and that `supabase/` has no live project yet.

- [ ] **Step 2: Write `README.md`**

Human-facing: what belajaryuk is, how to run `app/` locally (`cd app && npx expo start`), where the schema lives, current MVP status.

- [ ] **Step 3: Commit and push**

```bash
git add CLAUDE.md README.md
git commit -m "docs: add CLAUDE.md and README for belajaryuk"
git -C /home/claude/belajaryuk -c push.negotiate=true push -u origin main
```

- [ ] **Step 4: Verify push landed**

Run: `git ls-remote https://github.com/rayyanramadhan/belajaryuk main`
Expected: a commit hash printed (not empty).

- [ ] **Step 5: Sync to the user's local machine**

Copy the full repo contents back via `device_commit_files` so `/Users/rayyanramadhan/Documents/Antigravity/LMS` matches the pushed repo and Antigravity can open it immediately.
