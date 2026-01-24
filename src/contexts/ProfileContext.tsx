import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, ActivityLevel, FitnessGoal } from '@/types/diet';
import { calculateTDEEWithRecommendations, TDEEResult } from '@/utils/tdeeCalculator';

const STORAGE_KEY = 'user-fitness-profile';

const defaultProfile: UserProfile = {
  gender: 'male',
  weight: 0,
  weightUnit: 'kg',
  height: 0,
  heightUnit: 'cm',
  age: 0,
  activityLevel: 'moderate',
  trainingDays: 3,
};

interface ProfileContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  isProfileComplete: boolean;
  calculateTDEE: (goal: FitnessGoal) => TDEEResult | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return defaultProfile;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultProfile, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to parse stored profile:', e);
      }
    }
    return defaultProfile;
  });

  // Persist to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updates }));
  };

  const clearProfile = () => {
    setProfileState(defaultProfile);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isProfileComplete = 
    !!profile.gender && 
    profile.weight > 0 && 
    profile.height > 0 && 
    profile.age >= 15;

  const calculateTDEE = (goal: FitnessGoal): TDEEResult | null => {
    if (!isProfileComplete) return null;
    return calculateTDEEWithRecommendations(profile, goal);
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        clearProfile,
        isProfileComplete,
        calculateTDEE,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}
