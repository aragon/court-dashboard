import * as Sentry from '@sentry/browser'
import env from './environment'
import { getNetworkType } from './lib/web3-utils'

const SENTRY_DSN = env('SENTRY_DSN')
export const sentryEnabled = Boolean(SENTRY_DSN && env('ENABLE_SENTRY'))

export default function initializeSentry() {
  if (sentryEnabled) {
    Sentry.init({
      dsn: env('SENTRY_DSN'),
      environment: getNetworkType(env('CHAIN_ID')),
      release: 'court-dashboard@' + env('BUILD'),
    })
  }
}
