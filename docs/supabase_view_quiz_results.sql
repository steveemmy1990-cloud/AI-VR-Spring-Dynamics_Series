-- View: quiz results only (knowledge test scores and AI-help usage).
-- Run in Supabase SQL Editor. Then use Table Editor → quiz_results to see scores clearly.
-- Columns: user_id, session_id, level, timestamp, score_out_of_10, sought_ai_help_for_questions

create or replace view public.quiz_results as
select
  user_id,
  session_id,
  level,
  "timestamp",
  numeric_value as score_out_of_10,
  message_text as sought_ai_help_for_questions
from public.experiment_events
where event_type = 'QUIZ_RESULT'
order by user_id, "timestamp";

comment on view public.quiz_results is 'Knowledge test: score (out of 10) and which question numbers used Seek AI help (comma-separated).';
