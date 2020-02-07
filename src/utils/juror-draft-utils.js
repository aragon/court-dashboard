import { addressesEqual } from '../lib/web3-utils'
import { isvoteLeaked } from './crvoting-utils'

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
