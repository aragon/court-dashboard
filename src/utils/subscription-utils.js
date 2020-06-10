import { toMs } from './date-utils'
import { bigNum } from '../lib/math-utils'

export function transformSubscriptionModuleDataAttributes(subscriptionModule) {
  return {
    ...subscriptionModule,
    currentPeriod: parseInt(subscriptionModule.currentPeriod, 10),
    feeAmount: bigNum(subscriptionModule.feeAmount),
    periodDuration: toMs(parseInt(subscriptionModule.periodDuration)),
    periods: subscriptionModule.periods.map(period => ({
      ...period,
      id: parseInt(period.id, 10),
      totalActiveBalance: period.totalActiveBalance,
      collectedFees: bigNum(period.collectedFees),
    })),
  }
}

export function transformClaimedFeesDataAttributes(claimedFee) {
  return {
    ...claimedFee,
    period: {
      id: parseInt(claimedFee.period.id, 10),
    },
  }
}

export function hasJurorClaimed(claimedFees, periodId) {
  return claimedFees.some(claimedFee => claimedFee.period.id === periodId)
}
