import { bigNum } from '../lib/math-utils'

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

export function shouldAppealerBeRewarded(appeal) {
  const { maker, taker, appealedRuling, opposedRuling, round } = appeal

  // If appealer is maker and the appeal wasn't confirmed
  if (maker && !opposedRuling) {
    return true
  }

  const { finalRuling } = round.dispute
  // If maker && appealed for the wininig outcome
  if (maker && appealedRuling === finalRuling) {
    return true
  }

  // If taker && confirmed appealed for the winning outcome
  if (taker && opposedRuling === finalRuling) {
    return true
  }

  // Check if  none of the appealers ruled for the winning outcome
  return appealedRuling !== finalRuling && opposedRuling !== finalRuling
}

// Assumes the appealer should be rewarded
export function getAppealerFees(appeal, totalFees) {
  const {
    maker,
    appealDeposit,
    appealedRuling,
    taker,
    confirmAppealDeposit,
    opposedRuling,
    round,
  } = appeal

  // If appealer is maker and the appeal wasn't confirmed
  if (maker && !opposedRuling) {
    return appealDeposit
  }

  const { finalRuling } = round.dispute
  const totalDeposit = appealDeposit.add(confirmAppealDeposit)

  // if appealed for the wininig outcome
  if (
    (maker && appealedRuling === finalRuling) ||
    (taker && opposedRuling === finalRuling)
  ) {
    return totalDeposit.sub(totalFees)
  }

  // Note that since we assume that the appealer should be rewarded, we can ensure
  // that the finalRuling is different from the appealedRuling and the opossedRuling
  const feesRefund = totalFees.div(2)
  return (maker ? appealDeposit : confirmAppealDeposit).sub(feesRefund)
}
