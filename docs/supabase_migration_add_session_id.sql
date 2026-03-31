-- Run this if you already have experiment_events without session_id.
-- Adds session_id and the analysis views. Safe to run multiple times.

alter table public.experiment_events add column if not exists session_id uuid;

update public.experiment_events set session_id = gen_random_uuid() where session_id is null;

create or replace view public.level1_events as
  select * from public.experiment_events where level = 1 order by user_id, session_id, "timestamp";

create or replace view public.level2_events as
  select * from public.experiment_events where level = 2 order by user_id, session_id, "timestamp";

create or replace view public.participant_sessions as
  select user_id, session_id, level, min("timestamp") as started_at, max("timestamp") as last_event_at, count(*) as event_count
  from public.experiment_events
  group by user_id, session_id, level
  order by user_id, level, started_at;
