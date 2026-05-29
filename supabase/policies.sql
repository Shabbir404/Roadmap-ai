-- Run once in Supabase → SQL Editor (fixes cross-device sync + progress saves)

alter table public.roadmaps enable row level security;
alter table public.progress enable row level security;
alter table public.career_cache enable row level security;

drop policy if exists "roadmaps_select_own" on public.roadmaps;
drop policy if exists "roadmaps_insert_own" on public.roadmaps;
drop policy if exists "roadmaps_update_own" on public.roadmaps;
drop policy if exists "roadmaps_delete_own" on public.roadmaps;

create policy "roadmaps_select_own" on public.roadmaps
  for select using (auth.uid() = user_id);
create policy "roadmaps_insert_own" on public.roadmaps
  for insert with check (auth.uid() = user_id);
create policy "roadmaps_update_own" on public.roadmaps
  for update using (auth.uid() = user_id);
create policy "roadmaps_delete_own" on public.roadmaps
  for delete using (auth.uid() = user_id);

drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;

create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.progress
  for update using (auth.uid() = user_id);
create policy "progress_delete_own" on public.progress
  for delete using (auth.uid() = user_id);

drop policy if exists "career_cache_select_own" on public.career_cache;
drop policy if exists "career_cache_insert_own" on public.career_cache;
drop policy if exists "career_cache_update_own" on public.career_cache;
drop policy if exists "career_cache_delete_own" on public.career_cache;

create policy "career_cache_select_own" on public.career_cache
  for select using (auth.uid() = user_id);
create policy "career_cache_insert_own" on public.career_cache
  for insert with check (auth.uid() = user_id);
create policy "career_cache_update_own" on public.career_cache
  for update using (auth.uid() = user_id);
create policy "career_cache_delete_own" on public.career_cache
  for delete using (auth.uid() = user_id);
