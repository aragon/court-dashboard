import { init as initSentry, captureMessage } from '@sentry/browser'
import env from './environment'
import { getNetworkType } from './lib/web3-utils'

const SENTRY_DSN = env('SENTRY_DSN')
export const sentryEnabled = Boolean(SENTRY_DSN && env('ENABLE_SENTRY'))

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
