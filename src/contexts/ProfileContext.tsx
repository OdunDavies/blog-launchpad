import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { UserProfile, ActivityLevel, ACTIVITY_MULTIPLIERS } from '@/types/diet';

interface ProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  bmr: number | null;
  tdee: number | null;
  isProfileComplete: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'muscleatlas-user-profile';

const defaultProfile: UserProfile = {};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  // Persist profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  }, [profile]);

  // Calculate BMR using Mifflin-St Jeor equation
  const bmr = useMemo(() => {
    const { gender, weight, height, age } = profile;
    if (!gender || !weight || !height || !age) return null;

    // Mifflin-St Jeor Formula
    // Male: (10 × weight) + (6.25 × height) - (5 × age) + 5
    // Female: (10 × weight) + (6.25 × height) - (5 × age) - 161
    const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
    return Math.round(gender === 'male' ? baseBMR + 5 : baseBMR - 161);
  }, [profile]);

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = useMemo(() => {
    if (!bmr || !profile.activityLevel) return null;
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel]);
  }, [bmr, profile.activityLevel]);

  // Check if profile has minimum required data
  const isProfileComplete = useMemo(() => {
    const { gender, weight, height, age, activityLevel } = profile;
    return !!(gender && weight && height && age && activityLevel);
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(defaultProfile);
  }, []);

  const value = useMemo(() => ({
    profile,
    updateProfile,
    clearProfile,
    bmr,
    tdee,
    isProfileComplete,
  }), [profile, updateProfile, clearProfile, bmr, tdee, isProfileComplete]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
