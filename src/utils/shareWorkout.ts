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
 * Encodes a workout plan to a URL-safe base64 string
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
  // Use TextEncoder for proper UTF-8 handling, then base64 encode
  const bytes = new TextEncoder().encode(jsonString);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Make base64 URL-safe by replacing + with - and / with _
  const base64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
}

/**
 * Decodes a base64 string back to a workout plan
 */
export function decodeWorkout(encoded: string): DecodedWorkout | null {
  try {
    // Restore base64 padding and convert URL-safe characters back
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode base64 to binary, then use TextDecoder for UTF-8
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const compressed: ShareableWorkout = JSON.parse(jsonString);

    // Validate required fields
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
 * Generates a shareable URL for a workout plan
 */
export function generateShareUrl(workout: WorkoutForSharing): string {
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
      // Fallback for older browsers
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
export async function shareNatively(workout: WorkoutForSharing): Promise<boolean> {
  const url = generateShareUrl(workout);
  const workoutName = workout.name || `${workout.splitDays || workout.daysPerWeek}-Day ${workout.goal} Plan`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: workoutName,
        text: `Check out this workout plan: ${workoutName}`,
        url: url,
      });
      return true;
    } catch (error) {
      // User cancelled or share failed
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
  // Try native share first (works on mobile and some desktop browsers)
  if (navigator.share) {
    const shared = await shareNatively(workout);
    if (shared) {
      onSuccess('native');
      return;
    }
  }

  // Fall back to clipboard
  const url = generateShareUrl(workout);
  const copied = await copyToClipboard(url);
  
  if (copied) {
    onSuccess('clipboard');
  } else {
    onError('Failed to copy link to clipboard');
  }
}
