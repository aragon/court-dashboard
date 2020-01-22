import { addressesEqual } from '../lib/web3-utils'

export function getJurorDraft(round, jurorId) {
  if (!round) return null

  return round.jurors.find(jurorDraft =>
    addressesEqual(jurorDraft.juror.id, jurorId)
  )
}

export function jurorVoted(jurorDraft) {
  return !!jurorDraft.commitment
}
