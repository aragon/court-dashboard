import { addressesEqual } from '../lib/web3-utils'
import { isvoteLeaked } from './crvoting-utils'

export function getJurorDraft(round, jurorId) {
  if (!round) return null

  return round.jurors.find(jurorDraft =>
    addressesEqual(jurorDraft.juror.id, jurorId)
  )
}

export function jurorVoted(jurorDraft) {
  return !!jurorDraft.commitment
}

//
export function canJurorReveal(jurorDraft) {
  const hasNotRevealed = !jurorDraft.outcome
  return (
    hasNotRevealed &&
    jurorVoted(jurorDraft) &&
    !isvoteLeaked(jurorDraft.outcome)
  )
}
