# belajaryuk

A learning platform MVP with two tracks: **English learning** (gamified, Duolingo-style drills) and **Parenting** (self-paced video + quizzes). Built for web, iOS, and Android from a single Expo codebase.

## Status

Early scaffold stage — no screens or live backend yet. What exists:
- Expo app skeleton (`app/`), builds for web + iOS + Android.
- Supabase schema as SQL migrations (`supabase/`) — not yet applied to a live project.
- A Vercel project (`belajaryuk`) linked for future web deployment.
- Four specialized Claude Code subagents (`.claude/agents/`) scoped to design, backend, app build, and content modeling.

## Run locally

```bash
cd app
npx expo start        # then press w for web, or scan the QR code for a device
```

## Docs

- Design spec: `docs/superpowers/specs/2026-11-22-belajaryuk-mvp-design.md`
- Scaffolding plan: `docs/superpowers/plans/2026-11-22-scaffold-belajaryuk.md`
- Supabase notes: `supabase/README.md`
