'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import type { UserProfile } from '@/types/profile'
import { ActivityLevel, ACTIVITY_MULTIPLIERS } from '@/types/profile'
import { convertWeightToKg, convertHeightToCm } from '@/lib/convert'
import { useAuth } from './AuthContext'
import { pushProfile, pullProfile } from '@/lib/sync'
import type { WeightUnit } from '@/types/workout-tracker'

interface ProfileContextType {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  clearProfile: () => void
  bmr: number | null
  tdee: number | null
  isProfileComplete: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const STORAGE_KEY = 'muscleatlas-user-profile'

const defaultProfile: UserProfile = {
  weightUnit: 'kg',
  heightUnit: 'cm',
  trainingDays: 3,
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile
    } catch {
      return defaultProfile
    }
  })
  const initialSyncDone = useRef(false)

  useEffect(() => {
    if (!user || initialSyncDone.current) return
    initialSyncDone.current = true

    pullProfile(user.id).then(({ profile: cloudProfile, weightUnit }) => {
      if (cloudProfile) {
        setProfile(prev => ({ ...prev, ...cloudProfile }))
      }
      if (weightUnit) {
        setProfile(prev => ({ ...prev, weightUnit: weightUnit as UserProfile['weightUnit'] }))
      }
    }).catch(err => console.error('Failed to pull profile:', err))
  }, [user])

  useEffect(() => {
    initialSyncDone.current = false
  }, [user?.id])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }, [profile])

  useEffect(() => {
    if (!user) return
    const timer = setTimeout(async () => {
      const weightUnit = (profile.weightUnit || 'kg') as WeightUnit
      await pushProfile(user.id, profile, weightUnit)
    }, 2000)
    return () => clearTimeout(timer)
  }, [user, profile])

  const bmr = useMemo(() => {
    const { gender, weight, weightUnit, height, heightUnit, heightInches, age } = profile
    if (!gender || !weight || !height || !age) return null

    const weightKg = convertWeightToKg(weight, weightUnit || 'kg')
    const heightCm = convertHeightToCm(height, heightUnit || 'cm', heightInches)

    const baseBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * age)
    return Math.round(gender === 'male' ? baseBMR + 5 : baseBMR - 161)
  }, [profile])

  const tdee = useMemo(() => {
    if (!bmr || !profile.activityLevel) return null
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel])
  }, [bmr, profile.activityLevel])

  const isProfileComplete = useMemo(() => {
    const { gender, weight, height, age, activityLevel } = profile
    return !!(gender && weight && height && age && activityLevel)
  }, [profile])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }, [])

  const clearProfile = useCallback(() => {
    setProfile(defaultProfile)
  }, [])

  const value = useMemo(() => ({
    profile, updateProfile, clearProfile, bmr, tdee, isProfileComplete,
  }), [profile, updateProfile, clearProfile, bmr, tdee, isProfileComplete])

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
