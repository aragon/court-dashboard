import { bigNum } from '../lib/math-utils'

export function getTotalFees(fees, key = 'amount') {
  return Array.isArray(fees)
    ? fees.reduce((acc, fee) => acc.add(fee[key]), bigNum(0))
    : bigNum(0)
}

export function getTotalSettledFees(arbitrableFees, appealFees) {
  return [arbitrableFees, appealFees]
    .map(fees => getTotalFees(fees, 'settledAmount'))
    .reduce((acc, amount) => acc.add(amount), bigNum(0))
}

export function filterSettledRounds(fees) {
  return fees.map(({ rounds, ...fee }) => ({
    ...fee,
    rounds: rounds
      .filter(({ settled }) => !settled)
      .map(({ roundId }) => roundId),
  }))
}
