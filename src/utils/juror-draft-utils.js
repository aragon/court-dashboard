import { addressesEqual } from '../lib/web3-utils'
import { isvoteLeaked } from './crvoting-utils'
import { bigNum } from '../lib/math-utils'
import { toMs } from './date-utils'

export function getJurorDraft(round, jurorId) {
  if (!round) return null

  return round.jurors.find(jurorDraft =>
    addressesEqual(jurorDraft.juror.id, jurorId)
  )
}

export function hasJurorVoted(jurorDraft) {
  return !!jurorDraft.commitment
}

export function canJurorReveal(jurorDraft) {
  const hasNotRevealed = !jurorDraft.outcome
  return (
    hasNotRevealed &&
    hasJurorVoted(jurorDraft) &&
    !isvoteLeaked(jurorDraft.outcome)
  )
}

export function isJurorCoherent(jurorDraft) {
  const { dispute } = jurorDraft.round
  return dispute.finalRuling !== 0 && jurorDraft.outcome === dispute.finalRuling
}

export function transformJurorDataAttributes(jurorDraft) {
  const { rewardedAt, round, weight } = jurorDraft

  return {
    ...jurorDraft,
    rewardedAt: toMs(parseInt(rewardedAt || 0, 10)),
    weight: bigNum(weight),
    round: {
      ...round,
      number: parseInt(round.number, 10),
      collectedTokens: bigNum(round.collectedTokens),
      jurorFees: bigNum(round.jurorFees),
    },
  }
}
