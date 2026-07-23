import { z } from 'zod'

export const weightUnitSchema = z.enum(['kg', 'lbs'])

export const profileSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  age: z.number().min(1).max(150).optional(),
  weight: z.number().min(1).max(700).optional(),
  weightUnit: weightUnitSchema.optional(),
  height: z.number().min(1).max(300).optional(),
  heightUnit: z.enum(['cm', 'ft']).optional(),
  heightInches: z.number().min(0).max(11).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']).optional(),
  trainingDays: z.number().min(1).max(7).optional(),
})

export const exerciseLogSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  exerciseName: z.string(),
  sets: z.array(z.object({
    setNumber: z.number(),
    reps: z.number(),
    weight: z.number(),
  })),
  notes: z.string().optional(),
})

export function safeJsonParse<T>(json: string | null, fallback: T, schema?: z.ZodType<T>): T {
  if (!json) return fallback
  try {
    const parsed = JSON.parse(json)
    if (schema) return schema.parse(parsed)
    return parsed as T
  } catch {
    return fallback
  }
}

export function safeLocalStorageGet<T>(key: string, fallback: T, schema?: z.ZodType<T>): T {
  try {
    return safeJsonParse(localStorage.getItem(key), fallback, schema)
  } catch {
    return fallback
  }
}
