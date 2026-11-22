-- Add track_interest to profiles, captured at signup (English / Parenting / Both)

alter table profiles
  add column if not exists track_interest text;

alter table profiles
  add constraint profiles_track_interest_check
  check (track_interest is null or track_interest in ('english', 'parenting', 'both'));
