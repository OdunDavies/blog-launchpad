function shouldReport(): boolean {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN
}

if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error || event.message)
    if (shouldReport()) {
      void import('./sentry').then(({ default: Sentry }) => {
        Sentry.captureException(event.error || event.message)
      })
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason)
    if (shouldReport()) {
      void import('./sentry').then(({ default: Sentry }) => {
        Sentry.captureException(event.reason)
      })
    }
  })
}
