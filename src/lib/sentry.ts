import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN as string,
  environment: process.env.NODE_ENV || 'production',
})

export default Sentry
