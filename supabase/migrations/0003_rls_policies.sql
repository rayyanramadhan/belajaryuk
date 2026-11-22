-- RLS policies to unblock the app for signed-in users.
-- RLS is already enabled (Supabase default) on all 5 tables; this file adds
-- the policies themselves, which have been missing since 0001.

-- profiles: a user can only see/change their own row
create policy "profiles_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- lesson_progress: a user can only see/change their own progress rows
create policy "lesson_progress_select_own"
  on lesson_progress for select
  using (auth.uid() = profile_id);

create policy "lesson_progress_insert_own"
  on lesson_progress for insert
  with check (auth.uid() = profile_id);

create policy "lesson_progress_update_own"
  on lesson_progress for update
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- tracks, courses, lessons: public read-only catalog content.
-- No write policies — content is seeded/managed outside the app for MVP.
create policy "tracks_public_read"
  on tracks for select
  using (true);

create policy "courses_public_read"
  on courses for select
  using (true);

create policy "lessons_public_read"
  on lessons for select
  using (true);
