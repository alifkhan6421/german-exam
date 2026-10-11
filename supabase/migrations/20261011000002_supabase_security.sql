-- @supabase-only
-- Supabase-specific security: link profiles to auth.users, enable row-level security,
-- and create private storage buckets. Not applied to the embedded development database.
--
-- The Next.js server uses the service role for exam delivery and strips answer keys before
-- anything reaches the browser. These policies are defence in depth for any direct client
-- access with the anon key: students can only ever see their own rows, and nobody but the
-- service role can read exam content, answer keys or other users' data.

alter table profiles
  add constraint profiles_auth_fk foreign key (id) references auth.users(id) on delete cascade;

-- Create a profile row when a Supabase auth user signs up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Enable RLS everywhere.
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','exam_tracks','blueprint_versions','blueprint_confirmations','exams','exam_versions',
    'review_decisions','audio_assets','attempts','attempt_answers','attempt_events','submission_media',
    'assessments','issue_reports','plans','subscriptions','billing_customers','payments','stripe_events',
    'usage_counters','generation_jobs','audit_log','consents'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Public catalogue data.
create policy "tracks readable" on exam_tracks for select using (active);
create policy "plans readable" on plans for select using (active);
-- Exams list (metadata only — content lives in exam_versions, which has no client policy).
create policy "published exams readable" on exams for select using (status = 'published');

-- Own profile. Role changes are not possible through the client: no update policy covers
-- the role column because updates go through the server with the service role.
create policy "own profile read" on profiles for select using (auth.uid() = id);

-- Own learning data, read-only from the client.
create policy "own attempts" on attempts for select using (auth.uid() = user_id);
create policy "own answers" on attempt_answers for select using (
  exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid())
);
create policy "own assessments" on assessments for select using (
  exists (select 1 from attempts a where a.id = attempt_id and a.user_id = auth.uid())
);
create policy "own media" on submission_media for select using (auth.uid() = user_id);
create policy "own subscriptions" on subscriptions for select using (auth.uid() = user_id);
create policy "own payments" on payments for select using (auth.uid() = user_id);
create policy "own usage" on usage_counters for select using (auth.uid() = user_id);
create policy "own consents" on consents for select using (auth.uid() = user_id);

-- Private buckets: exam media (approved audio, images) and student submissions.
insert into storage.buckets (id, name, public, file_size_limit) values ('exam-media', 'exam-media', false, 26214400) on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit) values ('submissions', 'submissions', false, 15728640) on conflict (id) do nothing;
-- No storage.objects policies are created: all access is via short-lived signed URLs
-- issued by the server after an authorisation check.
