'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export const useAnalytics = () => {
  const trackEvent = useCallback((eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters)
    }
  }, [])

  const trackPageView = useCallback((pagePath: string, pageTitle?: string) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      })
    }
  }, [])

  const trackTabChange = useCallback((tabName: string) => {
    trackEvent('tab_change', { tab_name: tabName })
  }, [trackEvent])

  const trackExerciseView = useCallback((exerciseName: string, muscleGroup: string) => {
    trackEvent('exercise_view', {
      exercise_name: exerciseName,
      muscle_group: muscleGroup,
    })
  }, [trackEvent])

  const trackWorkoutGenerated = useCallback((workoutType: string, exerciseCount: number) => {
    trackEvent('workout_generated', {
      workout_type: workoutType,
      exercise_count: exerciseCount,
    })
  }, [trackEvent])

  const trackPdfDownload = useCallback((workoutName: string) => {
    trackEvent('pdf_download', { workout_name: workoutName })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    trackTabChange,
    trackExerciseView,
    trackWorkoutGenerated,
    trackPdfDownload,
  }
}
