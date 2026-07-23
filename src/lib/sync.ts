import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/profile';
import type { WorkoutLog, ExercisePR, WeightUnit } from '@/types/workout-tracker';
import type { TemplateDay, WorkoutTemplate } from '@/data/workoutTemplates';
import type { SavedPlan } from '@/types/saved-plan';

// ─── Types ───────────────────────────────────────────

export interface AllCloudData {
  profile: UserProfile | null;
  weightUnit: WeightUnit | null;
  workoutLogs: WorkoutLog[];
  exercisePRs: Record<string, ExercisePR>;
  favorites: string[];
  customTemplates: WorkoutTemplate[];
  savedPlans: SavedPlan[];
}

// ─── Profile ──────────────────────────────────────────

export async function pushProfile(userId: string, profile: UserProfile, weightUnit: WeightUnit) {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      id: userId,
      profile_data: profile as any,
      weight_unit: weightUnit,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  if (error) console.error('Failed to push profile:', error);
}

export async function pullProfile(userId: string): Promise<{ profile: UserProfile | null; weightUnit: WeightUnit | null }> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('profile_data, weight_unit')
    .eq('id', userId)
    .maybeSingle();
  if (error || !data) return { profile: null, weightUnit: null };
  return {
    profile: data.profile_data as UserProfile | null,
    weightUnit: (data.weight_unit as WeightUnit) || null,
  };
}

// ─── Workout Logs ─────────────────────────────────────

export async function pushWorkoutLogs(userId: string, logs: WorkoutLog[]) {
  const rows = logs.map(log => ({
    id: log.id,
    user_id: userId,
    date: log.date,
    start_time: log.startTime,
    end_time: log.endTime || null,
    duration: log.duration || null,
    workout_name: log.workoutName || null,
    template_id: log.templateId || null,
    template_day_index: log.templateDayIndex ?? null,
    exercises: JSON.stringify(log.exercises),
    notes: log.notes || null,
    mood: log.mood || null,
    source: log.source || null,
    source_id: log.sourceId || null,
    source_day_index: log.sourceDayIndex ?? null,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length === 0) return;

  const { error } = await supabase
    .from('workout_logs')
    .upsert(rows, { onConflict: 'user_id,id', ignoreDuplicates: false });
  if (error) console.error('Failed to push workout logs:', error);
}

export async function pullWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  if (error || !data) return [];

  return data.map(row => {
    let exercises = row.exercises;
    if (typeof exercises === 'string') { try { exercises = JSON.parse(exercises); } catch { exercises = []; } }
    return {
      id: row.id as string,
      date: (row.date as string).substring(0, 10),
      startTime: row.start_time as string,
      endTime: row.end_time as string | undefined,
      duration: row.duration as number | undefined,
      workoutName: row.workout_name as string | undefined,
      templateId: row.template_id as string | undefined,
      templateDayIndex: row.template_day_index as number | undefined,
      exercises: exercises as any[],
      notes: row.notes as string | undefined,
      mood: row.mood as any,
      source: row.source as any,
      sourceId: row.source_id as string | undefined,
      sourceDayIndex: row.source_day_index as number | undefined,
    } as WorkoutLog;
  });
}

// ─── Exercise PRs ─────────────────────────────────────

export async function pushExercisePRs(userId: string, prs: Record<string, ExercisePR>) {
  const entries = Object.values(prs);
  if (entries.length === 0) return;

  const rows = entries.map(pr => ({
    exercise_id: pr.exerciseId,
    user_id: userId,
    exercise_name: pr.exerciseName,
    weight: pr.weight,
    weight_unit: pr.weightUnit,
    reps: pr.reps,
    estimated_1rm: pr.estimated1RM,
    date: pr.date,
    workout_log_id: pr.workoutLogId || null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('exercise_prs')
    .upsert(rows, { onConflict: 'user_id,exercise_id', ignoreDuplicates: false });
  if (error) console.error('Failed to push PRs:', error);
}

export async function pullExercisePRs(userId: string): Promise<Record<string, ExercisePR>> {
  const { data, error } = await supabase
    .from('exercise_prs')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return {};

  const prs: Record<string, ExercisePR> = {};
  for (const row of data) {
    prs[row.exercise_id as string] = {
      exerciseId: row.exercise_id as string,
      exerciseName: row.exercise_name as string,
      weight: row.weight as number,
      weightUnit: row.weight_unit as WeightUnit,
      reps: row.reps as number,
      estimated1RM: row.estimated_1rm as number,
      date: (row.date as string).substring(0, 10),
      workoutLogId: (row.workout_log_id as string) || '',
    };
  }
  return prs;
}

// ─── Favorites ────────────────────────────────────────

export async function pushFavorites(userId: string, favorites: string[]) {
  const { error: delError } = await supabase
    .from('favorite_exercises')
    .delete()
    .eq('user_id', userId);
  if (delError) {
    console.error('Failed to clear favorites:', delError);
    return;
  }

  if (favorites.length === 0) return;

  const rows = favorites.map(exerciseId => ({ user_id: userId, exercise_id: exerciseId }));
  const { error } = await supabase.from('favorite_exercises').insert(rows);
  if (error) console.error('Failed to push favorites:', error);
}

export async function pullFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('favorite_exercises')
    .select('exercise_id')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map(row => row.exercise_id as string);
}

// ─── Custom Templates ─────────────────────────────────

export async function pushCustomTemplates(userId: string, templates: WorkoutTemplate[]) {
  if (templates.length === 0) return;

  const rows = templates.map(t => ({
    id: t.id,
    user_id: userId,
    name: t.name,
    description: t.description || null,
    difficulty: t.difficulty || null,
    days_per_week: t.daysPerWeek,
    goal: t.goal || null,
    schedule: JSON.stringify(t.schedule),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('custom_templates')
    .upsert(rows, { onConflict: 'user_id,id', ignoreDuplicates: false });
  if (error) console.error('Failed to push custom templates:', error);
}

export async function pullCustomTemplates(userId: string): Promise<WorkoutTemplate[]> {
  const { data, error } = await supabase
    .from('custom_templates')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return [];

  return data.map(row => {
    let schedule = row.schedule;
    if (typeof schedule === 'string') { try { schedule = JSON.parse(schedule); } catch { schedule = []; } }
    return {
      id: row.id as string,
      name: row.name as string,
      description: (row.description as string) || '',
      difficulty: (row.difficulty as WorkoutTemplate['difficulty']) || 'beginner',
      daysPerWeek: row.days_per_week as number,
      goal: (row.goal as string) || '',
      schedule: schedule as unknown as TemplateDay[],
    };
  });
}

// ─── Saved Plans ──────────────────────────────────────

export async function pushSavedPlans(userId: string, plans: SavedPlan[]) {
  if (plans.length === 0) return;

  const rows = plans.map(p => ({
    id: p.id,
    user_id: userId,
    name: p.name,
    split_days: p.splitDays,
    goal: p.goal,
    gender: p.gender || null,
    target_muscles: p.targetMuscles ? JSON.stringify(p.targetMuscles) : null,
    schedule: JSON.stringify(p.schedule),
    saved_at: p.savedAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('saved_plans')
    .upsert(rows, { onConflict: 'user_id,id', ignoreDuplicates: false });
  if (error) console.error('Failed to push saved plans:', error);
}

export async function pullSavedPlans(userId: string): Promise<SavedPlan[]> {
  const { data, error } = await supabase
    .from('saved_plans')
    .select('*')
    .eq('user_id', userId);
  if (error || !data) return [];

  return data.map(row => {
    let targetMuscles = row.target_muscles;
    if (typeof targetMuscles === 'string') { try { targetMuscles = JSON.parse(targetMuscles); } catch { targetMuscles = []; } }
    let schedule = row.schedule;
    if (typeof schedule === 'string') { try { schedule = JSON.parse(schedule); } catch { schedule = []; } }
    return {
      id: row.id as string,
      name: row.name as string,
      splitDays: row.split_days as number,
      goal: row.goal as string,
      gender: row.gender as string | undefined,
      targetMuscles: targetMuscles as unknown as string[] | undefined,
      schedule: schedule as unknown as SavedPlan['schedule'],
      savedAt: row.saved_at as string | undefined,
    };
  });
}

// ─── Bulk ─────────────────────────────────────────────

export async function pushAll(userId: string, data: AllCloudData) {
  await Promise.all([
    pushProfile(userId, data.profile || {} as UserProfile, data.weightUnit || 'kg'),
    pushWorkoutLogs(userId, data.workoutLogs),
    pushExercisePRs(userId, data.exercisePRs),
    pushFavorites(userId, data.favorites),
    pushCustomTemplates(userId, data.customTemplates),
    pushSavedPlans(userId, data.savedPlans),
  ]);
}

export async function pullAll(userId: string): Promise<AllCloudData> {
  const [profileRes, workoutLogs, exercisePRs, favorites, customTemplates, savedPlans] =
    await Promise.all([
      pullProfile(userId),
      pullWorkoutLogs(userId),
      pullExercisePRs(userId),
      pullFavorites(userId),
      pullCustomTemplates(userId),
      pullSavedPlans(userId),
    ]);

  return {
    profile: profileRes.profile,
    weightUnit: profileRes.weightUnit,
    workoutLogs,
    exercisePRs,
    favorites,
    customTemplates,
    savedPlans,
  };
}
