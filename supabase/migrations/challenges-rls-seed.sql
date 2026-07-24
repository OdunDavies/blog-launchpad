-- ============================================================
-- 1. Row Level Security — challenges table
-- ============================================================
alter table challenges enable row level security;

-- Anyone can read public challenges
drop policy if exists "Public challenges are readable by anyone" on challenges;
create policy "Public challenges are readable by anyone"
  on challenges for select
  using (visibility = 'public');

-- Invite-only challenges are readable by the creator or anyone who already joined
drop policy if exists "Invite-only readable by creator or participants" on challenges;
create policy "Invite-only readable by creator or participants"
  on challenges for select
  using (
    visibility = 'invite_only'
    and (
      auth.uid() = creator_id
      or exists (
        select 1 from challenge_participants
        where challenge_participants.challenge_id = challenges.id
        and challenge_participants.user_id = auth.uid()
      )
    )
  );

-- Signed-in users can create challenges as themselves
drop policy if exists "Users can create their own challenges" on challenges;
create policy "Users can create their own challenges"
  on challenges for insert
  with check (auth.uid() = creator_id);

-- Creator can update their own challenge
drop policy if exists "Creator can update own challenge" on challenges;
create policy "Creator can update own challenge"
  on challenges for update
  using (auth.uid() = creator_id);

-- ============================================================
-- 2. Row Level Security — challenge_participants table
-- ============================================================
alter table challenge_participants enable row level security;

-- Participants of a challenge can see each other
drop policy if exists "Participants visible to other participants" on challenge_participants;
create policy "Participants visible to other participants"
  on challenge_participants for select
  using (
    exists (
      select 1 from challenge_participants cp
      where cp.challenge_id = challenge_participants.challenge_id
      and cp.user_id = auth.uid()
    )
    or exists (
      select 1 from challenges
      where challenges.id = challenge_participants.challenge_id
      and challenges.creator_id = auth.uid()
    )
  );

-- A user can join (insert) only as themselves
drop policy if exists "Users can join as themselves" on challenge_participants;
create policy "Users can join as themselves"
  on challenge_participants for insert
  with check (auth.uid() = user_id);

-- A user can update only their own progress row
drop policy if exists "Users can update own progress" on challenge_participants;
create policy "Users can update own progress"
  on challenge_participants for update
  using (auth.uid() = user_id);

-- ============================================================
-- 3. Seed 5 curated challenges
--    Prerequisite: create a system auth user in Supabase dashboard
--    (Settings > Authentication > Users > Add User)
--    Email: system@muscleatlas.site, any password
--    Replace <SYSTEM_USER_UUID> below with that user's ID
-- ============================================================
-- insert into challenges (id, creator_id, creator_name, name, description, goal_metric, goal_target, duration_days, visibility, created_at, participant_count)
-- values
--   ('30-day-pushup', '<SYSTEM_USER_UUID>', 'MuscleAtlas', '30-Day Push-Up Challenge', 'Complete 3,000 push-ups in 30 days. Build chest, shoulder, and tricep endurance with this classic bodyweight challenge.', 'reps', 3000, 30, 'public', now(), 0),
--   ('squat-streak', '<SYSTEM_USER_UUID>', 'MuscleAtlas', '14-Day Squat Streak', 'Squat every day for 14 days. Build leg strength and consistency with daily squat sessions.', 'streak_days', 14, 14, 'public', now(), 0),
--   ('plank-progress', '<SYSTEM_USER_UUID>', 'MuscleAtlas', '21-Day Plank Progress', 'Hold plank for a cumulative 60 minutes over 21 days. Strengthen your core and improve stability.', 'reps', 60, 21, 'public', now(), 0),
--   ('deadlift-milestone', '<SYSTEM_USER_UUID>', 'MuscleAtlas', '28-Day Deadlift Builder', 'Accumulate 50,000 kg in deadlift volume over 28 days. Build posterior chain strength and track your progress.', 'weight', 50000, 28, 'public', now(), 0),
--   ('weekly-warrior', '<SYSTEM_USER_UUID>', 'MuscleAtlas', 'Weekly Warrior (4 Sessions)', 'Complete 4 workout sessions per week for 4 weeks. Build the habit of consistent training.', 'sessions', 16, 28, 'public', now(), 0)
-- on conflict (id) do nothing;
