-- belajaryuk MVP schema skeleton
-- Two tracks: english (gamified drills) and parenting (video + quiz)

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, -- 'english' | 'parenting'
  name text not null
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references tracks (id) on delete cascade,
  title text not null,
  description text
);

create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  position int not null,
  kind text not null, -- 'drill' (English gamified) | 'video_quiz' (Parenting)
  content jsonb not null default '{}'::jsonb
);

create table if not exists lesson_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  status text not null default 'not_started', -- 'not_started' | 'in_progress' | 'completed'
  completed_at timestamptz,
  unique (profile_id, lesson_id)
);

-- seed the two tracks
insert into tracks (slug, name) values
  ('english', 'English Learning'),
  ('parenting', 'Parenting')
on conflict (slug) do nothing;
