export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  author: string;
  tags: string[];
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-bicep-exercises',
    title: '10 Best Bicep Exercises for Mass',
    description: 'Build bigger arms with these science-backed bicep exercises.',
    image: '/og-image.png',
    date: '2026-06-01',
    author: 'MuscleAtlas Team',
    tags: ['biceps', 'arms', 'hypertrophy'],
    readTime: '5 min',
    content: `Building bigger biceps requires a combination of proper exercise selection, progressive overload, and adequate recovery. Here are the 10 best bicep exercises ranked by muscle activation.

## 1. Barbell Curl
The classic mass builder. Use a shoulder-width grip and avoid swinging.

## 2. Dumbbell Hammer Curl
Targets the brachialis for thicker-looking arms.

## 3. Incline Dumbbell Curl
Stretches the long head for better peak development.

## 4. Cable Curl
Provides constant tension throughout the movement.

## 5. Preacher Curl
Eliminates cheating and isolates the biceps.

## 6. Concentration Curl
Perfect for targeting the peak.

## 7. Chin-Up
The king of compound bicep builders.

## 8. EZ Bar Reverse Curl
Targets brachialis and forearms.

## 9. Spider Curl
Great for mind-muscle connection.

## 10. Zottman Curl
Combines curl and reverse curl for full arm development.

**Pro Tip:** Use 8-12 reps for hypertrophy, and focus on the eccentric (lowering) phase.`,
  },
  {
    slug: 'push-pull-legs-routine',
    title: 'The Ultimate Push Pull Legs Routine',
    description: 'A complete PPL split for balanced muscle growth and strength.',
    image: '/og-image.png',
    date: '2026-05-28',
    author: 'MuscleAtlas Team',
    tags: ['workout split', 'ppl', 'strength'],
    readTime: '6 min',
    content: `The Push Pull Legs (PPL) split is one of the most effective training frameworks for natural lifters. Here's everything you need.

## Why PPL Works
PPL allows you to train each muscle group twice per week while providing adequate recovery.

## The Split
- **Push Day 1:** Chest, shoulders, triceps
- **Pull Day 1:** Back, biceps, rear delts
- **Legs Day 1:** Quads, hamstrings, glutes, calves
- **Push Day 2:** Slight variation (more volume, different exercises)
- **Pull Day 2:** Same
- **Legs Day 2:** Same
- **Rest**

## Sample Push Day
- Bench Press: 4x8
- Overhead Press: 3x10
- Incline Dumbbell Press: 3x12
- Lateral Raises: 4x15
- Tricep Pushdown: 3x12

## Sample Pull Day
- Deadlift: 3x5
- Pull-Ups: 3x8
- Barbell Row: 4x10
- Face Pulls: 3x15
- Barbell Curl: 3x12

## Sample Leg Day
- Squat: 4x6
- Romanian Deadlift: 3x10
- Leg Press: 3x12
- Walking Lunges: 3x12
- Calf Raises: 4x15

Track your progress with the MuscleAtlas workout tracker!`,
  },
  {
    slug: 'progressive-overload-guide',
    title: 'Progressive Overload: The Complete Guide',
    description: 'Learn how to apply progressive overload for consistent gains.',
    image: '/og-image.png',
    date: '2026-05-25',
    author: 'MuscleAtlas Team',
    tags: ['progressive overload', 'hypertrophy', 'strength'],
    readTime: '7 min',
    content: `Progressive overload is the single most important principle for building muscle and strength. Without it, your body has no reason to adapt.

## What Is Progressive Overload?
Progressive overload means gradually increasing the demands placed on your muscles over time.

## Methods of Progressive Overload
1. **Increase Weight** — The most obvious method. Add 2.5-5 kg when you hit your rep target.
2. **Increase Reps** — If you can't add weight, add reps within your rep range.
3. **Increase Sets** — Adding an extra set increases total volume.
4. **Decrease Rest** — Shorten rest periods to increase density.
5. **Improve Form** — Better range of motion and tempo increase difficulty.

## How to Track
Use the MuscleAtlas tracker to log your lifts and see when you're due for a progression.

## When to Deload
After 4-8 weeks of hard training, take a deload week (50% volume) to recover.

Remember: consistency beats intensity. Small, consistent increases over months and years produce the best results.`,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}
