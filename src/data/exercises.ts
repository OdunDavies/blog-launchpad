export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'forearms'
  | 'abs' 
  | 'obliques'
  | 'quads' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves'
  | 'traps'
  | 'lats';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl: string;
  instructions: string[];
  category: 'push' | 'pull' | 'legs' | 'core' | 'compound' | 'cardio' | 'stretching';
  imageUrl?: string;
}

export const exercises: Exercise[] = [
  // CHEST
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'Barbell, Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    instructions: [
      'Lie flat on a bench with feet planted on the floor',
      'Grip the bar slightly wider than shoulder-width',
      'Lower the bar to your mid-chest',
      'Press up until arms are fully extended'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-bench-press.jpg'
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    equipment: 'Dumbbells, Incline Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
    instructions: [
      'Set bench to 30-45 degree incline',
      'Hold dumbbells at shoulder level',
      'Press up and slightly inward',
      'Lower with control'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/incline-dumbbell-press.jpg'
  },
  {
    id: 'push-ups',
    name: 'Push-Ups',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders', 'abs'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches floor',
      'Keep core tight and body in straight line',
      'Push back up to starting position'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/push-up.jpg'
  },
  {
    id: 'cable-flyes',
    name: 'Cable Flyes',
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    equipment: 'Cable Machine',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/Iwe6AmxVf7o',
    instructions: [
      'Set cables at chest height',
      'Step forward with slight lean',
      'Bring handles together in front of chest',
      'Squeeze and return with control'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cable-crossover.jpg'
  },
  {
    id: 'decline-bench-press',
    name: 'Decline Barbell Bench Press',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    equipment: 'Barbell, Decline Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/OR6fP0gVAyI',
    instructions: [
      'Lie on a decline bench with feet secured under pads',
      'Grip the bar slightly wider than shoulder-width',
      'Lower the bar to your lower chest',
      'Press up until arms are fully extended'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/decline-bench-press.jpg'
  },
  {
    id: 'dumbbell-pullover',
    name: 'Dumbbell Pullover',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['lats', 'triceps', 'shoulders'],
    equipment: 'Dumbbell, Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/moKuOuFNBDM',
    instructions: [
      'Lie across a bench with upper back supported, feet on floor',
      'Hold one dumbbell with both hands above your chest',
      'Lower the dumbbell in an arc behind your head with slight elbow bend',
      'Feel the stretch in your chest and lats, then return to start'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-pullover.jpg'
  },

  // BACK
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    primaryMuscles: ['lats', 'back'],
    secondaryMuscles: ['biceps', 'forearms'],
    equipment: 'Pull-up Bar',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    instructions: [
      'Hang from bar with overhand grip',
      'Pull yourself up until chin clears bar',
      'Lower with control',
      'Avoid swinging'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/pull-up.jpg'
  },
  {
    id: 'barbell-rows',
    name: 'Barbell Bent-Over Rows',
    primaryMuscles: ['back', 'lats'],
    secondaryMuscles: ['biceps', 'forearms', 'traps'],
    equipment: 'Barbell',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/FWJR5Ve8bnQ',
    instructions: [
      'Hinge at hips with slight knee bend',
      'Keep back flat and core tight',
      'Pull bar to lower chest',
      'Squeeze shoulder blades at top'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-bent-over-row.jpg'
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'back'],
    equipment: 'Cable Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
    instructions: [
      'Sit with thighs secured under pad',
      'Grip bar wider than shoulder-width',
      'Pull bar to upper chest',
      'Control the return'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cable-lat-pulldown.jpg'
  },
  {
    id: 'seated-cable-row',
    name: 'Seated Cable Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'lats', 'traps'],
    equipment: 'Cable Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/GZbfZ033f74',
    instructions: [
      'Sit with feet on platform, knees slightly bent',
      'Pull handle to lower chest',
      'Keep back straight throughout',
      'Squeeze shoulder blades together'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cable-seated-row.jpg'
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'lats', 'traps'],
    equipment: 'Barbell, Landmine or T-Bar Machine',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/j3Igk5I5gPg',
    instructions: [
      'Straddle the bar with feet shoulder-width apart',
      'Bend at hips, keep back flat, and grip the handles',
      'Pull the weight toward your lower chest',
      'Squeeze shoulder blades together at the top'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/t-bar-row.jpg'
  },
  {
    id: 'single-arm-dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'lats', 'traps'],
    equipment: 'Dumbbell, Bench',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/pYcpY20QaE8',
    instructions: [
      'Place one knee and hand on a bench, other foot on floor',
      'Hold a dumbbell with your free hand at arm\'s length',
      'Pull the dumbbell toward your hip keeping elbow close',
      'Squeeze your lat at the top, lower with control'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-one-arm-row.jpg'
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: 'Barbell Overhead Press',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'traps'],
    equipment: 'Barbell',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
    instructions: [
      'Stand with bar at shoulder level',
      'Press bar overhead until arms locked',
      'Keep core tight',
      'Lower with control'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-overhead-press.jpg'
  },
  {
    id: 'lateral-raises',
    name: 'Dumbbell Lateral Raises',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
    instructions: [
      'Stand with dumbbells at sides',
      'Raise arms out to sides until parallel to floor',
      'Slight bend in elbows',
      'Lower with control'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lateral-raise.jpg'
  },
  {
    id: 'face-pulls',
    name: 'Face Pulls',
    primaryMuscles: ['shoulders', 'traps'],
    secondaryMuscles: ['back'],
    equipment: 'Cable Machine, Rope',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/rep-qVOkqgk',
    instructions: [
      'Set cable at face height',
      'Pull rope towards face',
      'Separate hands at end of movement',
      'Squeeze rear delts'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cable-face-pull.jpg'
  },

  // TRAPS
  {
    id: 'barbell-shrugs',
    name: 'Barbell Shrugs',
    primaryMuscles: ['traps'],
    secondaryMuscles: ['shoulders', 'forearms'],
    equipment: 'Barbell',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/gQDOmOd4-D8',
    instructions: [
      'Stand holding a barbell at arm\'s length in front of thighs',
      'Keeping arms straight, shrug shoulders straight up toward ears',
      'Squeeze at the top for a count',
      'Lower with control and repeat'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-shrug.jpg'
  },
  {
    id: 'dumbbell-shrugs',
    name: 'Dumbbell Shrugs',
    primaryMuscles: ['traps'],
    secondaryMuscles: ['shoulders', 'forearms'],
    equipment: 'Dumbbells',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/SvW7gUyNJOk',
    instructions: [
      'Stand holding dumbbells at arm\'s length at your sides',
      'Keeping arms straight, shrug shoulders straight up',
      'Hold the peak contraction briefly',
      'Lower slowly and repeat'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-shrug.jpg'
  },

  // ARMS
  {
    id: 'barbell-curl',
    name: 'Barbell Curl',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: 'Barbell',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/kwG2ipFRgfo',
    instructions: [
      'Stand with barbell at arm\'s length',
      'Curl bar up keeping elbows stationary',
      'Squeeze at top',
      'Lower with control'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-curl.jpg'
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: 'Cable Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/2-LAMcpzODU',
    instructions: [
      'Stand facing cable machine',
      'Keep elbows at sides',
      'Push bar down until arms straight',
      'Control the return'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cable-pushdown.jpg'
  },
  {
    id: 'hammer-curls',
    name: 'Hammer Curls',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4',
    instructions: [
      'Hold dumbbells with neutral grip',
      'Curl up keeping palms facing each other',
      'Squeeze at top',
      'Lower with control'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-hammer-curl.jpg'
  },
  {
    id: 'preacher-curls',
    name: 'Barbell Preacher Curls',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: 'EZ Bar, Preacher Bench',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/fIWP-FRFNU0',
    instructions: [
      'Sit at a preacher bench with upper arms on the pad',
      'Grip the EZ bar with palms up at shoulder width',
      'Curl the bar up toward your shoulders',
      'Lower with control, keeping arms on the pad'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-preacher-curl.jpg'
  },
  {
    id: 'concentration-curls',
    name: 'Dumbbell Concentration Curls',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: 'Dumbbell, Bench',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/J9Yfe3vzA9M',
    instructions: [
      'Sit on a bench with legs spread, hold a dumbbell in one hand',
      'Brace your elbow against your inner thigh',
      'Curl the dumbbell toward your shoulder',
      'Squeeze at the top and lower with control'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-concentration-curl.jpg'
  },
  {
    id: 'incline-dumbbell-curls',
    name: 'Incline Dumbbell Curls',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    equipment: 'Dumbbells, Incline Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/SoPx_gDBGxk',
    instructions: [
      'Sit on an incline bench set to 45 degrees, holding dumbbells',
      'Let arms hang straight down with palms facing forward',
      'Curl both dumbbells toward shoulders',
      'Lower slowly, feeling a deep stretch at the bottom'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/incline-dumbbell-curl.jpg'
  },
  {
    id: 'skull-crushers',
    name: 'Skull Crushers',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: 'EZ Bar, Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
    instructions: [
      'Lie on bench with bar above chest',
      'Lower bar to forehead by bending elbows',
      'Keep upper arms stationary',
      'Extend arms back up'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-skull-crusher.jpg'
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['shoulders'],
    equipment: 'Dumbbell or Cable Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/-Vyt2QdsR7E',
    instructions: [
      'Stand holding a dumbbell with both hands overhead',
      'Lower the dumbbell behind your head by bending elbows',
      'Keep upper arms close to ears and stationary',
      'Extend arms back up to starting position'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/overhead-tricep-extension.jpg'
  },
  {
    id: 'close-grip-bench-press',
    name: 'Close-Grip Bench Press',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    equipment: 'Barbell, Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/fECGFqMcs-I',
    instructions: [
      'Lie on a flat bench and grip the bar with hands shoulder-width',
      'Unrack the bar and lower it to your lower chest',
      'Keep elbows tucked close to your body',
      'Press up until arms are fully extended'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/close-grip-bench-press.jpg'
  },
  {
    id: 'tricep-kickbacks',
    name: 'Dumbbell Tricep Kickbacks',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/6SS6K3lAwZ8',
    instructions: [
      'Hinge forward at hips with dumbbells in hand, back flat',
      'Pull elbows up to ribcage at 90 degrees',
      'Extend arms straight back, squeezing triceps',
      'Return to start with control'
    ],
    category: 'push',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-tricep-kickback.jpg'
  },

  // FOREARMS
  {
    id: 'wrist-curls',
    name: 'Barbell Wrist Curls',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    equipment: 'Barbell, Bench',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/Oe_TFg0xdFE',
    instructions: [
      'Sit on a bench with forearms resting on thighs',
      'Hold a barbell with palms facing up, wrists hanging off knees',
      'Curl the bar up by flexing wrists',
      'Lower slowly and repeat'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-wrist-curl.jpg'
  },
  {
    id: 'reverse-wrist-curls',
    name: 'Reverse Wrist Curls',
    primaryMuscles: ['forearms'],
    secondaryMuscles: [],
    equipment: 'Barbell, Bench',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/5eSnN7kITJM',
    instructions: [
      'Sit on a bench with forearms resting on thighs',
      'Hold a barbell with palms facing down',
      'Extend wrists upward keeping forearms stationary',
      'Lower with control and repeat'
    ],
    category: 'pull',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/reverse-wrist-curl.jpg'
  },
  {
    id: 'farmers-walk',
    name: 'Farmer\'s Walk',
    primaryMuscles: ['forearms', 'traps'],
    secondaryMuscles: ['abs', 'glutes', 'shoulders'],
    equipment: 'Dumbbells or Kettlebells',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/EV5s3ClOqoE',
    instructions: [
      'Hold heavy dumbbells at your sides with tall posture',
      'Walk forward in a straight line with short, controlled steps',
      'Keep core engaged and shoulders back',
      'Walk for distance or time, then set weights down'
    ],
    category: 'compound',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/farmers-walk.jpg'
  },

  // LEGS
  {
    id: 'squats',
    name: 'Barbell Back Squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'abs'],
    equipment: 'Barbell, Squat Rack',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
    instructions: [
      'Bar on upper back, feet shoulder-width',
      'Descend by bending knees and hips',
      'Keep chest up and knees tracking toes',
      'Drive through heels to stand'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-back-squat.jpg'
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    primaryMuscles: ['back', 'glutes', 'hamstrings'],
    secondaryMuscles: ['quads', 'forearms', 'traps'],
    equipment: 'Barbell',
    difficulty: 'advanced',
    videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q',
    instructions: [
      'Stand with feet hip-width, bar over mid-foot',
      'Hinge and grip bar just outside legs',
      'Keep back flat, drive through floor',
      'Stand tall, squeeze glutes at top'
    ],
    category: 'compound',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-conventional-deadlift.jpg'
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['glutes', 'hamstrings'],
    equipment: 'Leg Press Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
    instructions: [
      'Sit with back flat against pad',
      'Feet shoulder-width on platform',
      'Lower weight with control',
      'Press through heels'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/sled-leg-press.jpg'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back'],
    equipment: 'Barbell or Dumbbells',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/7AaaYhMqTws',
    instructions: [
      'Stand with weight at hip level',
      'Push hips back, slight knee bend',
      'Lower until stretch in hamstrings',
      'Drive hips forward to stand'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-romanian-deadlift.jpg'
  },
  {
    id: 'lunges',
    name: 'Walking Lunges',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: 'Bodyweight or Dumbbells',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/L8fvypPrzzs',
    instructions: [
      'Step forward into lunge',
      'Lower until back knee nearly touches ground',
      'Drive through front heel',
      'Step forward with opposite leg'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-lunge.jpg'
  },
  {
    id: 'leg-curl',
    name: 'Lying Leg Curl',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    equipment: 'Leg Curl Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/1Tq3QdYUuHs',
    instructions: [
      'Lie face down on machine',
      'Pad behind ankles',
      'Curl weight up by bending knees',
      'Lower with control'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/lever-lying-leg-curl.jpg'
  },
  {
    id: 'calf-raises',
    name: 'Standing Calf Raises',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: 'Calf Raise Machine or Step',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc',
    instructions: [
      'Stand on edge of platform',
      'Rise up onto toes',
      'Squeeze at top',
      'Lower heels below platform level'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/lever-standing-calf-raise.jpg'
  },
  {
    id: 'seated-calf-raises',
    name: 'Seated Calf Raises',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: 'Seated Calf Raise Machine or Dumbbell',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/FEewFamWj4E',
    instructions: [
      'Sit on the machine with thighs under the pads',
      'Place balls of feet on the platform, heels hanging off',
      'Raise heels by extending ankles as high as possible',
      'Lower slowly until calves are fully stretched'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/seated-calf-raise.jpg'
  },
  {
    id: 'donkey-calf-raises',
    name: 'Donkey Calf Raises',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    equipment: 'Donkey Calf Machine or Bench + Partner',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/JbUQ9OM-A_o',
    instructions: [
      'Lean forward over a bench with hands supporting your weight',
      'Have a partner sit on your lower back for resistance',
      'Raise heels by extending ankles as high as possible',
      'Lower slowly and repeat'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/donkey-calf-raise.jpg'
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'quads'],
    equipment: 'Barbell, Bench',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/SEdqd1n0cvg',
    instructions: [
      'Sit on floor with upper back against bench',
      'Roll barbell over hips (use pad for comfort)',
      'Drive through heels, squeeze glutes to lift hips',
      'Pause at top with hips fully extended',
      'Lower with control, keeping core engaged'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/barbell-hip-thrust.jpg'
  },
  {
    id: 'sumo-squat',
    name: 'Sumo Squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'abs'],
    equipment: 'Barbell, Dumbbell, or Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/u2oXPmPH0hA',
    instructions: [
      'Stand with feet wider than shoulder-width, toes pointed out 45 degrees',
      'Keep chest up and core engaged',
      'Lower by pushing hips back and bending knees',
      'Descend until thighs are parallel or below',
      'Drive through heels to stand'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/sumo-squat.jpg'
  },
  {
    id: 'step-ups',
    name: 'Step Ups',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    equipment: 'Bench or Box, Dumbbells (optional)',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/vLgNjXucUs0',
    instructions: [
      'Stand facing a sturdy bench or box',
      'Step up with one foot, driving through the heel',
      'Bring the other foot up to stand on platform',
      'Step back down with control',
      'Alternate legs or complete all reps on one side'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-step-up.jpg'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: 'Bench, Dumbbells (optional)',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/9FOMyxA3Lw4',
    instructions: [
      'Stand about 2 feet in front of a bench',
      'Place rear foot on bench behind you',
      'Lower until front thigh is parallel to ground',
      'Keep torso upright and core tight',
      'Push through front heel to stand'
    ],
    category: 'legs',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/dumbbell-bulgarian-split-squat.jpg'
  },

  // CORE
  {
    id: 'plank',
    name: 'Plank',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['obliques', 'shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
    instructions: [
      'Forearms and toes on ground',
      'Body in straight line',
      'Engage core throughout',
      'Hold for time'
    ],
    category: 'core',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/front-plank.jpg'
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg Raises',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['obliques', 'forearms'],
    equipment: 'Pull-up Bar',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/Pr1ieGZ5atk',
    instructions: [
      'Hang from bar with arms extended',
      'Raise legs until parallel or higher',
      'Control the descent',
      'Avoid swinging'
    ],
    category: 'core',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/hanging-leg-raise.jpg'
  },
  {
    id: 'cable-woodchop',
    name: 'Cable Woodchops',
    primaryMuscles: ['obliques', 'abs'],
    secondaryMuscles: ['shoulders'],
    equipment: 'Cable Machine',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/pAplQXk3dkU',
    instructions: [
      'Set cable high or low',
      'Rotate torso pulling cable across body',
      'Keep arms relatively straight',
      'Control the return'
    ],
    category: 'core',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cable-wood-chop.jpg'
  },
  {
    id: 'russian-twist',
    name: 'Russian Twists',
    primaryMuscles: ['obliques'],
    secondaryMuscles: ['abs'],
    equipment: 'Bodyweight or Medicine Ball',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/wkD8rjkodUI',
    instructions: [
      'Sit with knees bent, lean back slightly',
      'Hold weight at chest',
      'Rotate side to side',
      'Keep core engaged'
    ],
    category: 'core',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/weighted-russian-twist.jpg'
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    primaryMuscles: ['obliques'],
    secondaryMuscles: ['abs', 'shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/eCkH6oE-Fls',
    instructions: [
      'Lie on your side with legs stacked and forearm on floor',
      'Lift hips off the ground forming a straight line from head to feet',
      'Hold position while keeping core braced',
      'Repeat on the other side'
    ],
    category: 'core',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/side-plank.jpg'
  },
  {
    id: 'bicycle-crunches',
    name: 'Bicycle Crunches',
    primaryMuscles: ['obliques'],
    secondaryMuscles: ['abs'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/1we3bh9uhqY',
    instructions: [
      'Lie on your back with hands behind head and legs raised',
      'Bring one knee toward chest while rotating opposite elbow toward it',
      'Alternate sides in a pedaling motion',
      'Keep lower back pressed into the floor throughout'
    ],
    category: 'core',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/bicycle-crunch.jpg'
  },

  // CARDIO / HIIT
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    primaryMuscles: ['quads', 'calves'],
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8',
    instructions: [
      'Stand with feet together, arms at sides',
      'Jump feet out while raising arms overhead',
      'Jump back to starting position',
      'Maintain a steady rhythm'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/jumping-jack.jpg'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    primaryMuscles: ['quads', 'chest'],
    secondaryMuscles: ['shoulders', 'triceps', 'abs', 'glutes'],
    equipment: 'Bodyweight',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/dZgVxmf6jkA',
    instructions: [
      'Start standing, drop into squat with hands on floor',
      'Jump feet back into plank position',
      'Perform a push-up (optional)',
      'Jump feet forward and explode up with arms overhead'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/burpee.jpg'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'quads', 'glutes'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
    instructions: [
      'Start in plank position',
      'Drive one knee toward chest',
      'Quickly switch legs in a running motion',
      'Keep hips low and core engaged'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/mountain-climber.jpg'
  },
  {
    id: 'box-jumps',
    name: 'Box Jumps',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves', 'hamstrings'],
    equipment: 'Plyo Box',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/NBY9-kTuHEk',
    instructions: [
      'Stand facing the box with feet shoulder-width apart',
      'Bend knees and swing arms back',
      'Explode up and land softly on box',
      'Step down and repeat'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/box-jump.jpg'
  },
  {
    id: 'battle-ropes',
    name: 'Battle Ropes',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['biceps', 'triceps', 'abs', 'back'],
    equipment: 'Battle Ropes',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/a5YtGf6Q3Rs',
    instructions: [
      'Hold rope ends with firm grip',
      'Slight squat stance with core braced',
      'Create alternating waves with arms',
      'Maintain intensity for timed intervals'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/battle-rope.jpg'
  },
  {
    id: 'kettlebell-swings',
    name: 'Kettlebell Swings',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['back', 'shoulders', 'abs'],
    equipment: 'Kettlebell',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8',
    instructions: [
      'Stand with feet wider than shoulder-width',
      'Hinge at hips, grip kettlebell with both hands',
      'Drive hips forward explosively to swing weight',
      'Let weight swing to chest height, control descent'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/kettlebell-swing.jpg'
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    primaryMuscles: ['calves'],
    secondaryMuscles: ['quads', 'shoulders', 'forearms'],
    equipment: 'Jump Rope',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/u3zgHI8QnqE',
    instructions: [
      'Hold handles at hip height',
      'Rotate rope with wrists, not arms',
      'Jump just high enough to clear rope',
      'Land softly on balls of feet'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/jump-rope.jpg'
  },
  {
    id: 'rowing-machine',
    name: 'Rowing Machine',
    primaryMuscles: ['back', 'lats'],
    secondaryMuscles: ['biceps', 'quads', 'glutes', 'abs'],
    equipment: 'Rowing Machine',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/H0r_ZPXJLtg',
    instructions: [
      'Sit with feet strapped in, grab handle',
      'Push with legs first, then pull with arms',
      'Lean back slightly at the finish',
      'Return by extending arms, then bending knees'
    ],
    category: 'cardio',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/rowing-machine.jpg'
  },

  // STRETCHING - Dynamic Stretches (Pre-workout)
  {
    id: 'leg-swings',
    name: 'Leg Swings (Front/Back)',
    primaryMuscles: ['hamstrings', 'quads'],
    secondaryMuscles: ['glutes'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/AkqakLhh1fI',
    instructions: [
      'Stand next to a wall or sturdy object for balance',
      'Swing one leg forward and backward in a controlled manner',
      'Keep your core engaged and standing leg slightly bent',
      'Perform 10-15 swings per leg'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/leg-swing.jpg'
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['traps'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/140RTsLjjgs',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Extend arms out to sides at shoulder height',
      'Make small circles, gradually increasing size',
      'Reverse direction after 15-20 circles'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/arm-circle.jpg'
  },
  {
    id: 'hip-circles',
    name: 'Hip Circles',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['abs', 'obliques'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/5PoEQKjH1lg',
    instructions: [
      'Stand with feet shoulder-width apart, hands on hips',
      'Make large circles with your hips',
      'Keep upper body stable',
      'Perform 10 circles in each direction'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/hip-circle.jpg'
  },
  {
    id: 'walking-high-knees',
    name: 'Walking High Knees',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['abs', 'glutes'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/ZZZoCNMU48U',
    instructions: [
      'Walk forward while lifting knees to hip height',
      'Pump opposite arm with each step',
      'Keep core engaged and back straight',
      'Continue for 20-30 steps'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/high-knee.jpg'
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    primaryMuscles: ['quads', 'hamstrings'],
    secondaryMuscles: ['calves'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/Bsj4QC7xgJk',
    instructions: [
      'Jog in place or move forward',
      'Kick heels up toward glutes',
      'Keep upper body upright',
      'Continue for 20-30 seconds'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/butt-kick.jpg'
  },
  {
    id: 'torso-twists',
    name: 'Standing Torso Twists',
    primaryMuscles: ['obliques'],
    secondaryMuscles: ['abs', 'back'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/8yKcJDnCr5A',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Extend arms in front or hold them at chest',
      'Rotate torso side to side',
      'Keep hips facing forward'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/torso-twist.jpg'
  },

  // STRETCHING - Static Stretches (Post-workout)
  {
    id: 'standing-hamstring-stretch',
    name: 'Standing Hamstring Stretch',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves', 'back'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/LdAdFy4-EqE',
    instructions: [
      'Stand with feet together',
      'Hinge at hips and reach toward toes',
      'Keep knees slightly bent if needed',
      'Hold for 20-30 seconds'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/standing-hamstring-stretch.jpg'
  },
  {
    id: 'quad-stretch',
    name: 'Standing Quad Stretch',
    primaryMuscles: ['quads'],
    secondaryMuscles: [],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/WJm9zA2NY8E',
    instructions: [
      'Stand on one leg, use wall for balance if needed',
      'Grab ankle and pull heel toward glute',
      'Keep knees together and hips forward',
      'Hold for 20-30 seconds per leg'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/standing-quad-stretch.jpg'
  },
  {
    id: 'pigeon-pose',
    name: 'Pigeon Pose',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: 'Mat',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/n4r1fVHuSCE',
    instructions: [
      'Start in plank or all-fours position',
      'Bring one knee forward behind your wrist',
      'Extend back leg straight behind you',
      'Lower torso over front leg and hold 30-60 seconds'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/pigeon-pose.jpg'
  },
  {
    id: 'chest-doorway-stretch',
    name: 'Chest Doorway Stretch',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    equipment: 'Doorway',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/WLd9T1mmrLk',
    instructions: [
      'Stand in a doorway with arms on door frame',
      'Elbows at 90 degrees at shoulder height',
      'Step forward to feel stretch in chest',
      'Hold for 20-30 seconds'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/doorway-chest-stretch.jpg'
  },
  {
    id: 'tricep-stretch',
    name: 'Overhead Tricep Stretch',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/FX_hWQSL2CU',
    instructions: [
      'Raise one arm overhead',
      'Bend elbow and reach hand toward opposite shoulder blade',
      'Use other hand to gently push elbow back',
      'Hold for 20-30 seconds per arm'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/tricep-stretch.jpg'
  },
  {
    id: 'child-pose',
    name: 'Child\'s Pose',
    primaryMuscles: ['back', 'lats'],
    secondaryMuscles: ['shoulders', 'glutes'],
    equipment: 'Mat',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/eqVMAPM00DM',
    instructions: [
      'Kneel on floor with toes together, knees apart',
      'Sit back on heels and extend arms forward',
      'Lower forehead to floor',
      'Hold for 30-60 seconds, breathing deeply'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/childs-pose.jpg'
  },
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Stretch',
    primaryMuscles: ['back'],
    secondaryMuscles: ['abs', 'shoulders'],
    equipment: 'Mat',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/kqnua4rHVVA',
    instructions: [
      'Start on hands and knees in tabletop position',
      'Inhale: drop belly, lift head and tailbone (cow)',
      'Exhale: round spine, tuck chin and tailbone (cat)',
      'Flow between positions for 10-15 reps'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/cat-cow-stretch.jpg'
  },
  {
    id: 'seated-forward-fold',
    name: 'Seated Forward Fold',
    primaryMuscles: ['hamstrings', 'back'],
    secondaryMuscles: ['calves'],
    equipment: 'Mat',
    difficulty: 'beginner',
    videoUrl: 'https://www.youtube.com/embed/t7Hdz6sBu_s',
    instructions: [
      'Sit with legs extended straight in front',
      'Hinge at hips and reach toward toes',
      'Keep spine long, avoid rounding back excessively',
      'Hold for 30-60 seconds'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/seated-forward-fold.jpg'
  },

  // STRETCHING - Mobility Work
  {
    id: 'worlds-greatest-stretch',
    name: 'World\'s Greatest Stretch',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['back', 'shoulders', 'quads'],
    equipment: 'Bodyweight',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/IikP_teeLkI',
    instructions: [
      'Start in a lunge position with back knee off ground',
      'Place same-side hand on floor inside front foot',
      'Rotate torso and reach opposite arm to ceiling',
      'Hold briefly, then switch sides. Repeat 5-8 per side'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/worlds-greatest-stretch.jpg'
  },
  {
    id: '90-90-hip-stretch',
    name: '90/90 Hip Stretch',
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings'],
    equipment: 'Mat',
    difficulty: 'intermediate',
    videoUrl: 'https://www.youtube.com/embed/9gH1Gxz7wkU',
    instructions: [
      'Sit with one leg in front bent 90 degrees, other behind also 90 degrees',
      'Keep spine tall and both hips grounded',
      'Lean forward over front leg for deeper stretch',
      'Hold for 30-60 seconds per side'
    ],
    category: 'stretching',
    imageUrl: 'https://liftmanual.com/wp-content/uploads/2023/04/90-90-hip-stretch.jpg'
  }
];
export const muscleGroups: { id: MuscleGroup; name: string; category: string }[] = [
  { id: 'chest', name: 'Chest', category: 'Upper Body' },
  { id: 'back', name: 'Back', category: 'Upper Body' },
  { id: 'lats', name: 'Latissimus Dorsi', category: 'Upper Body' },
  { id: 'traps', name: 'Trapezius', category: 'Upper Body' },
  { id: 'shoulders', name: 'Shoulders', category: 'Upper Body' },
  { id: 'biceps', name: 'Biceps', category: 'Arms' },
  { id: 'triceps', name: 'Triceps', category: 'Arms' },
  { id: 'forearms', name: 'Forearms', category: 'Arms' },
  { id: 'abs', name: 'Abdominals', category: 'Core' },
  { id: 'obliques', name: 'Obliques', category: 'Core' },
  { id: 'quads', name: 'Quadriceps', category: 'Lower Body' },
  { id: 'hamstrings', name: 'Hamstrings', category: 'Lower Body' },
  { id: 'glutes', name: 'Glutes', category: 'Lower Body' },
  { id: 'calves', name: 'Calves', category: 'Lower Body' },
];

// Equipment types extracted from exercises
export const equipmentTypes = [
  'Barbell',
  'Dumbbells',
  'Cable Machine',
  'Bodyweight',
  'Machine',
  'Bench',
  'Pull-up Bar',
  'Resistance Band',
  'Kettlebell',
] as const;

export type EquipmentType = typeof equipmentTypes[number];
