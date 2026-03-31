-- Experiment events table for Spring Dynamics data collection.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) for your project.
-- Then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify (or .env).

create table if not exists public.experiment_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  session_id uuid not null,
  "timestamp" timestamptz not null default now(),
  event_type text not null,
  event_category text,
  level smallint,
  object_id text,
  direction text,
  numeric_value numeric,
  message_text text,
  response_text text,
  position_x numeric,
  position_y numeric,
  position_z numeric,
  total_attached smallint,
  attached_springs_count smallint,
  fail_reason text,
  robot_active boolean,
  to_level smallint,
  spring_stiffness_1 numeric,
  spring_stiffness_2 numeric,
  mass_weight numeric,
  mass_weight_1 numeric
);

-- If you already have the table without session_id, run this once to add it (then make it required if needed):
-- alter table public.experiment_events add column if not exists session_id uuid;
-- update public.experiment_events set session_id = gen_random_uuid() where session_id is null;
-- alter table public.experiment_events alter column session_id set not null;  -- only if you want NOT NULL

-- Optional: enable Row Level Security (RLS) and allow anonymous insert for the anon key.
alter table public.experiment_events enable row level security;

create policy "Allow anonymous insert for experiment_events"
  on public.experiment_events
  for insert
  to anon
  with check (true);

-- Optional: restrict read to authenticated users or service role only.
create policy "Allow service role read"
  on public.experiment_events
  for select
  to service_role
  using (true);

comment on table public.experiment_events is 'One row per logged event. session_id groups one Level 1 or Level 2 submission per participant.';

-- Views for cleaner analysis (100+ participants): filter by level and group by participant/session.

create or replace view public.level1_events as
  select * from public.experiment_events where level = 1 order by user_id, session_id, "timestamp";

create or replace view public.level2_events as
  select * from public.experiment_events where level = 2 order by user_id, session_id, "timestamp";

create or replace view public.participant_sessions as
  select user_id, session_id, level, min("timestamp") as started_at, max("timestamp") as last_event_at, count(*) as event_count
  from public.experiment_events
  group by user_id, session_id, level
  order by user_id, level, started_at;

-- Knowledge test results: score (out of 10) and which questions used Seek AI help.
create or replace view public.quiz_results as
  select user_id, session_id, level, "timestamp",
         numeric_value as score_out_of_10,
         message_text as sought_ai_help_for_questions
  from public.experiment_events
  where event_type = 'QUIZ_RESULT'
  order by user_id, "timestamp";
