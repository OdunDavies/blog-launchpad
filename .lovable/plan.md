

# Add User Name and Explain BMR/TDEE in Plain Language

## Overview
This update makes two key improvements:
1. **Add a Name Field** to the user profile so plans can be personalized with the user's name (e.g., "John's Muscle Gain Diet Plan")
2. **Explain BMR and TDEE** in simple, non-technical language so anyone can understand what these numbers mean

---

## What Are BMR and TDEE? (User-Friendly Explanations)

| Term | Full Name | Simple Explanation |
|------|-----------|-------------------|
| **BMR** | Basal Metabolic Rate | The calories your body burns just to stay alive while resting (breathing, heartbeat, brain function) - like your body's "idle" energy cost |
| **TDEE** | Total Daily Energy Expenditure | Your total calories burned per day including all activities - this is what you need to eat to maintain your current weight |

---

## Changes Summary

### 1. Add Name Field to Profile

**Add to Profile Type (`src/types/diet.ts`):**
```typescript
interface UserProfile {
  name?: string;  // NEW - Optional user name for personalization
  gender: 'male' | 'female' | 'other';
  // ... rest of fields
}
```

### 2. Update Profile Editor UI

**Add name input field at the top of the form (`src/components/ProfileEditor.tsx`):**
- Text input for user's name (first name or nickname)
- Optional field - plans still work without it
- Placeholder: "Enter your name"

### 3. Add Plain Language Explanations

**Update TDEE Preview section in ProfileEditor:**

Current display:
```
BMR: 1650 kcal
TDEE: 2150 kcal
```

New display with explanations:
```
Your Daily Energy Stats

BMR (Basal Metabolic Rate): 1,650 kcal
└─ Calories your body burns at rest just to stay alive

TDEE (Total Daily Energy Expenditure): 2,150 kcal
└─ Total calories you burn per day with your activity level
```

### 4. Personalize Downloaded PDFs

**Diet Plan PDF (`src/utils/downloadDietPdf.ts`):**
- If name is set: "John's High Protein Diet Plan"
- Title includes user's name
- Profile summary shows name first

**Workout Plan PDF (`src/utils/downloadHtml.ts`):**
- If name is set: "John's 4-Day Muscle Building Workout"
- Personalized greeting in header

### 5. Update Profile Status Badge

**Show name in header badge (`src/components/ProfileStatusBadge.tsx`):**
- If name is set: Show "John, 75kg, 28yo"
- If no name: Show "75kg, 28yo" (current behavior)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/diet.ts` | Add optional `name` field to `UserProfile` |
| `src/contexts/ProfileContext.tsx` | Include `name` in default profile state |
| `src/components/ProfileEditor.tsx` | Add name input field + plain language BMR/TDEE explanations |
| `src/components/ProfileStatusBadge.tsx` | Display user's name in badge if available |
| `src/utils/downloadDietPdf.ts` | Personalize PDF title and header with user's name |
| `src/utils/downloadHtml.ts` | Personalize workout PDF with user's name |

---

## UI Design for Updated Profile Editor

**Name Field (New - at top of form):**
```text
┌─────────────────────────────────────────┐
│  Name (optional)                        │
│  ┌───────────────────────────────────┐  │
│  │ John                              │  │
│  └───────────────────────────────────┘  │
│  Used to personalize your plans         │
└─────────────────────────────────────────┘
```

**Updated TDEE Preview:**
```text
┌─────────────────────────────────────────┐
│  📊 Your Daily Energy Stats             │
├─────────────────────────────────────────┤
│                                         │
│  BMR (Basal Metabolic Rate)             │
│  1,650 kcal                             │
│  Calories burned at rest just to        │
│  keep your body functioning             │
│                                         │
│  TDEE (Total Daily Energy Expenditure)  │
│  2,150 kcal                             │
│  Total calories you burn each day       │
│  including your daily activities        │
│                                         │
└─────────────────────────────────────────┘
```

---

## Personalized PDF Examples

**Diet Plan Header (with name):**
```
🎯 Muscle Gain
John's 7-Day High Protein Meal Plan
John • 28y • male • 75kg • 175 cm • Moderately Active
```

**Workout Plan Header (with name):**
```
John's 4-Day Muscle Building Workout
📅 4 Days/Week  🎯 Muscle Gain  👤 Male
```

---

## Benefits

1. **Personal connection** - Users see their name on downloaded plans, making them feel custom-made
2. **Better understanding** - Plain language helps beginners understand what BMR/TDEE mean
3. **Easy sharing** - Named PDFs are easy to identify when saved or printed
4. **Optional field** - Name is optional, so it doesn't block users who prefer privacy

