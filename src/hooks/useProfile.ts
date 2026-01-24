import { useProfileContext } from '@/contexts/ProfileContext';
import { FitnessGoal } from '@/types/diet';

export function useProfile() {
  const context = useProfileContext();
  
  return {
    ...context,
    // Convenience method to get TDEE for a specific goal
    getTDEE: (goal: FitnessGoal) => context.calculateTDEE(goal),
    // Check if gender is set (used by workout generator)
    hasGender: !!context.profile.gender,
    // Get gender value
    gender: context.profile.gender,
  };
}
