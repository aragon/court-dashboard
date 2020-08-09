import { init as initSentry, captureMessage } from '@sentry/browser'
import env from './environment'
import { getNetworkType } from './lib/web3-utils'

export const sentryEnabled = Boolean(env('SENTRY_DSN'))

export default function initializeSentry() {
  if (sentryEnabled) {
    initSentry({
      dsn: env('SENTRY_DSN'),
      environment: getNetworkType(env('CHAIN_ID')),
      release: 'court-dashboard@' + env('BUILD'),
    })
  }
}

export function logWithSentry(message, level = 'warning') {
  if (sentryEnabled) {
    captureMessage(message, level)
  }
}
