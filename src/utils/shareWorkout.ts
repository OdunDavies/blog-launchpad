import { supabase } from '@/integrations/supabase/client';

// Shareable workout data structure (compressed version for URLs)
interface ShareableWorkout {
  n: string; // name
  d: number; // daysPerWeek/splitDays
  g: string; // goal
  s: Array<{
    d: string; // day
    f: string; // focus
    e: Array<{
      n: string; // name
      s: number; // sets
      r: string; // reps
      t: string; // rest
    }>;
  }>;
}

export interface WorkoutForSharing {
  name?: string;
  splitDays?: number;
  daysPerWeek?: number;
  goal: string;
  schedule: Array<{
    day: string;
    focus: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }>;
  }>;
}

export interface DecodedWorkout {
  name: string;
  daysPerWeek: number;
  goal: string;
  schedule: Array<{
    day: string;
    focus: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }>;
  }>;
}

/**
 * Generates a short unique ID for sharing
 */
function generateShortId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Saves a workout to the database and returns a short ID
 */
export async function saveSharedWorkout(workout: WorkoutForSharing): Promise<string> {
  const id = generateShortId();
  
  const workoutData: DecodedWorkout = {
    name: workout.name || `${workout.splitDays || workout.daysPerWeek}-Day ${workout.goal} Plan`,
    daysPerWeek: workout.splitDays || workout.daysPerWeek || workout.schedule.length,
    goal: workout.goal,
    schedule: workout.schedule,
  };

  // Use type assertion since the table might not be in generated types yet
  const { error } = await (supabase as any)
    .from('shared_workouts')
    .insert({
      id,
      workout_data: workoutData,
    });

  if (error) {
    console.error('Failed to save shared workout:', error);
    throw new Error('Failed to create share link');
  }

  return id;
}

/**
 * Fetches a shared workout by ID
 */
export async function getSharedWorkout(id: string): Promise<DecodedWorkout | null> {
  // Use type assertion since the table might not be in generated types yet
  const { data, error } = await (supabase as any)
    .from('shared_workouts')
    .select('workout_data')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Failed to fetch shared workout:', error);
    return null;
  }

  return data.workout_data as DecodedWorkout;
}

/**
 * Encodes a workout plan to a URL-safe base64 string (legacy support)
 */
export function encodeWorkout(workout: WorkoutForSharing): string {
  const compressed: ShareableWorkout = {
    n: workout.name || `${workout.splitDays || workout.daysPerWeek}-Day ${workout.goal} Plan`,
    d: workout.splitDays || workout.daysPerWeek || workout.schedule.length,
    g: workout.goal,
    s: workout.schedule.map(day => ({
      d: day.day,
      f: day.focus,
      e: day.exercises.map(ex => ({
        n: ex.name,
        s: ex.sets,
        r: ex.reps,
        t: ex.rest,
      })),
    })),
  };

  const jsonString = JSON.stringify(compressed);
  const bytes = new TextEncoder().encode(jsonString);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
}

/**
 * Decodes a base64 string back to a workout plan (legacy support)
 */
export function decodeWorkout(encoded: string): DecodedWorkout | null {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const compressed: ShareableWorkout = JSON.parse(jsonString);

    if (!compressed.s || !Array.isArray(compressed.s)) {
      return null;
    }

    return {
      name: compressed.n || 'Shared Workout Plan',
      daysPerWeek: compressed.d || compressed.s.length,
      goal: compressed.g || 'general',
      schedule: compressed.s.map(day => ({
        day: day.d,
        focus: day.f,
        exercises: day.e.map(ex => ({
          name: ex.n,
          sets: ex.s,
          reps: ex.r,
          rest: ex.t,
        })),
      })),
    };
  } catch (error) {
    console.error('Failed to decode workout:', error);
    return null;
  }
}

/**
 * Generates a shareable URL for a workout plan (async - saves to DB)
 */
export async function generateShareUrl(workout: WorkoutForSharing): Promise<string> {
  const id = await saveSharedWorkout(workout);
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared/${id}`;
}

/**
 * Generates a legacy shareable URL (base64 encoded, no DB)
 */
export function generateLegacyShareUrl(workout: WorkoutForSharing): string {
  const encoded = encodeWorkout(workout);
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared?plan=${encoded}`;
}

/**
 * Copies text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Uses the native Web Share API to share a workout (mobile-friendly)
 */
export async function shareNatively(url: string, workoutName: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: workoutName,
        text: `Check out this workout plan: ${workoutName}`,
        url: url,
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }
  return false;
}

/**
 * Shares a workout - tries native share first, falls back to clipboard
 */
export async function shareWorkout(
  workout: WorkoutForSharing,
  onSuccess: (method: 'native' | 'clipboard') => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const url = await generateShareUrl(workout);
    const workoutName = workout.name || `${workout.splitDays || workout.daysPerWeek}-Day ${workout.goal} Plan`;
    
    if (navigator.share) {
      const shared = await shareNatively(url, workoutName);
      if (shared) {
        onSuccess('native');
        return;
      }
    }

    const copied = await copyToClipboard(url);
    
    if (copied) {
      onSuccess('clipboard');
    } else {
      onError('Failed to copy link to clipboard');
    }
  } catch (error) {
    onError('Failed to create share link');
  }
}
