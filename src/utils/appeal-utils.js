import { bigNum } from '../lib/math-utils'
import { addressesEqual } from '../lib/web3-utils'

export function transformAppealDataAttributes(appeal) {
  const {
    appealedRuling,
    opposedRuling,
    appealDeposit,
    confirmAppealDeposit,
    round,
  } = appeal

  return {
    ...appeal,
    round: {
      ...round,
      number: parseInt(round.number, 10),
      dispute: {
        ...round.dispute,
        lastRoundId: parseInt(round.dispute.lastRoundId, 10),
      },
    },
    appealedRuling: parseInt(appealedRuling, 10),
    opposedRuling: parseInt(opposedRuling, 10),
    appealDeposit: bigNum(appealDeposit),
    confirmAppealDeposit: bigNum(confirmAppealDeposit),
  }
}

export function shouldAppealerBeRewarded(appeal, connectedAccount) {
  const { maker, taker, appealedRuling, opposedRuling, round } = appeal

  const isMaker = addressesEqual(connectedAccount, maker)

  // If appealer is maker and the appeal wasn't confirmed
  if (isMaker && !opposedRuling) {
    return true
  }

  const { finalRuling } = round.dispute
  // If maker && appealed for the wininig outcome
  if (isMaker && appealedRuling === finalRuling) {
    return true
  }

  const isTaker = addressesEqual(connectedAccount, taker)

  // If taker && confirmed appealed for the winning outcome
  if (isTaker && opposedRuling === finalRuling) {
    return true
  }

  // Check if  none of the appealers ruled for the winning outcome
  return appealedRuling !== finalRuling && opposedRuling !== finalRuling
}

// Assumes the appealer should be rewarded
export function getAppealerFees(appeal, totalFees, connectedAccount) {
  const {
    maker,
    appealDeposit,
    appealedRuling,
    taker,
    confirmAppealDeposit,
    opposedRuling,
    round,
  } = appeal

  const isMaker = connectedAccount === maker
  const isTaker = connectedAccount === taker

  // If appealer is maker and the appeal wasn't confirmed
  if (isMaker && !opposedRuling) {
    return appealDeposit
  }

  const { finalRuling } = round.dispute
  const totalDeposit = appealDeposit.add(confirmAppealDeposit)

  // if appealed for the wininig outcome
  if (
    (isMaker && appealedRuling === finalRuling) ||
    (isTaker && opposedRuling === finalRuling)
  ) {
    return totalDeposit.sub(totalFees)
  }

  // Note that since we assume that the appealer should be rewarded, we can ensure
  // that the finalRuling is different from the appealedRuling and the opossedRuling
  const feesRefund = totalFees.div(2)
  return (isMaker ? appealDeposit : confirmAppealDeposit).sub(feesRefund)
}
