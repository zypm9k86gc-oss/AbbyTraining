-- Follow-up to shared-training-migration.sql: require database-generated times.
-- Exact recorded timestamps must not be freely chosen by browser clients.
revoke insert on public.abby_exercise_events from authenticated;
grant insert (group_owner_id, actor_id, training_date, exercise_id)
  on public.abby_exercise_events to authenticated;
comment on column public.abby_exercise_events.performed_at is
  'Server-generated time when the exercise is logged; read-only to clients';
