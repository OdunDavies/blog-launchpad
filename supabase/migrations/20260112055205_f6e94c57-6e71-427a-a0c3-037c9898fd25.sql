-- Create shared_workouts table for short share links
create table public.shared_workouts (
  id text primary key,
  workout_data jsonb not null,
  created_at timestamptz default now(),
  views integer default 0
);

-- Enable RLS
alter table public.shared_workouts enable row level security;

-- Allow anyone to view shared workouts
create policy "Anyone can view shared workouts"
  on public.shared_workouts
  for select
  using (true);

-- Allow anyone to create shared workouts
create policy "Anyone can create shared workouts"
  on public.shared_workouts
  for insert
  with check (true);

-- Create index for faster lookups
create index idx_shared_workouts_created_at on public.shared_workouts(created_at desc);