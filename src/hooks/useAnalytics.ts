declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  const trackTabChange = (tabName: string) => {
    trackEvent('tab_change', { tab_name: tabName });
  };

  const trackExerciseView = (exerciseName: string, muscleGroup: string) => {
    trackEvent('exercise_view', { 
      exercise_name: exerciseName,
      muscle_group: muscleGroup 
    });
  };

  const trackWorkoutGenerated = (workoutType: string, exerciseCount: number) => {
    trackEvent('workout_generated', { 
      workout_type: workoutType,
      exercise_count: exerciseCount 
    });
  };

  const trackPdfDownload = (workoutName: string) => {
    trackEvent('pdf_download', { workout_name: workoutName });
  };

  return {
    trackEvent,
    trackPageView,
    trackTabChange,
    trackExerciseView,
    trackWorkoutGenerated,
    trackPdfDownload,
  };
};
