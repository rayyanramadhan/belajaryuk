# belajaryuk — MVP Design

## Intent & why

Ship a working MVP consumer learning platform, branded **belajaryuk**, covering two content tracks — English learning and Parenting — built by a team of specialized Claude Code subagents, on a GitHub repo (`rayyanramadhan/belajaryuk`, private) so other agentic tools (e.g. Antigravity, running locally on the user's machine) can keep building on it after this phase.

## Goals

- One codebase → web + iOS + Android, via Expo.
- Two content tracks with different core loops:
  - **English**: gamified, bite-sized lessons with streaks (Duolingo-style).
  - **Parenting**: self-paced video lessons + quizzes.
- Supabase backend: auth, Postgres schema (users, courses, lessons, progress), storage for media.
- Specialized subagents defined in `.claude/agents/` so future work is scoped by role, not ad-hoc.
- Repo initialized, committed, and pushed — ready for any agent (this session, Antigravity, etc.) to pick up.

## Non-goals (this phase)

- Payments / monetization.
- Live / cohort scheduling.
- Admin CMS for content authors (content is seeded directly for MVP).
- Analytics dashboards.

## Anti-goals

- A repo that isn't actually runnable.
- Agent definitions that don't genuinely separate concerns (one agent quietly doing another's job).
- Backend built before any real content model exists.

## Constraints

- MVP speed over architectural purity.
- Must run on web + mobile from one Expo codebase.
- Must end this phase with a pushed, private GitHub repo.
- No payment/financial actions in scope.

## Approaches considered (decided in brainstorming)

**Agent architecture:**
| Option | Trade-off |
|---|---|
| **Native Claude Code subagents (chosen)** | Zero extra infra, works immediately, agents run in parallel on independent slices. |
| External multi-agent pipeline (Claude Agent SDK) | Can run unattended on a server, but is building agent infra instead of the LMS — overkill for MVP. |
| Single agent, phased work | Simplest, but no real separation of concerns. |

**Tech stack:**
| Option | Trade-off |
|---|---|
| **Expo (React Native) + Supabase (chosen)** | Fastest path to a working MVP on web + mobile from one codebase. |
| Next.js (web) + React Native (mobile), separate codebases | More conventional split, doubles the build surface for an MVP. |
| Flutter + Node/Postgres | Fine if the team knows Dart; otherwise a new ecosystem with less AI-agent training data. |

## Decided — subagents to create

| Agent | Scope |
|---|---|
| `ui-ux-designer` | Screens, flows, design system for both tracks (different core loops) |
| `backend-architect` | Supabase schema, auth, RLS policies, storage structure |
| `mobile-web-builder` | Expo app implementation (screens → working code) |
| `content-structurer` | Course/lesson/progress data model for gamified-English vs. video-Parenting loops |

## Decisions made during setup (this builder's call, flagged for review)

- **Supabase status**: no existing account/project confirmed by the user. `backend-architect`'s job in this phase is to define schema/migrations only (SQL files) — no live Supabase project is provisioned yet. Real credentials get wired when the user has a project.
- **Repo**: `rayyanramadhan/belajaryuk`, private, created manually by the user, attached and cloned by this session.

## What's left to the subagents

Actual screens, detailed schema fields beyond the MVP skeleton, gamification mechanics for English, video/quiz structure for Parenting — fleshed out once each subagent is dispatched on concrete tickets after this scaffolding phase.
