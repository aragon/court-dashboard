import { AdjudicationState } from './types'
import { FINAL_ROUND_WEIGHT_PRECISION, PCT_BASE } from '../utils/dispute-utils'

export const bigExp = (x, y = 18) => `${x}${''.padEnd(y, '0')}`

export const accounts = [
  '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
  '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
  '0x22d491bde2303f2f43325b2108d26f1eaba1e32b',
  '0xe11ba2b4d45eaed5996cd0823791e0c93114882d',
  '0xd03ea8624c8c5987235048901fb614fdca89b117',
  '0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC',
  '0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9',
]

export const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const getDraftTermId = (state, courtConfig) => {
  const {
    currentTerm,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtConfig

  // When round has not yet started
  if (state === AdjudicationState.Invalid) {
    return String(currentTerm + 3)
  }

  if (state === AdjudicationState.Committing) {
    return currentTerm
  }

  if (state === AdjudicationState.Revealing) {
    return String(currentTerm - commitTerms)
  }

  if (state === AdjudicationState.Appealing) {
    return String(currentTerm - commitTerms - revealTerms)
  }

  if (state === AdjudicationState.ConfirmingAppeal) {
    return String(currentTerm - commitTerms - revealTerms - appealTerms)
  }

  return String(
    currentTerm -
      commitTerms -
      revealTerms -
      appealTerms -
      appealConfirmationTerms
  )
}
export const getTermStartTime = (termId, courtConfig) => {
  const { termDuration, terms } = courtConfig
  const secondsFromFirstTerm = termId * termDuration

  const firstTermStartTime = terms[0].startTime
  return firstTermStartTime + secondsFromFirstTerm
}

export const getMinActiveBalanceMultiple = (
  activeBalance,
  minActiveBalance
) => {
  if (activeBalance.lt(minActiveBalance)) {
    return '0'
  }

  return FINAL_ROUND_WEIGHT_PRECISION.mul(activeBalance).div(minActiveBalance)
}

export const pct = (self, pct) => self.mul(pct).div(PCT_BASE)

export const removeAppealCircularReferences = appeal => {
  return {
    ...appeal,
    round: {
      ...removeRoundCircularReferences(appeal.round),
      dispute: {
        ...appeal.round.dispute,
        rounds: appeal.round.dispute.rounds.map(({ number, jurorsNumber }) => ({
          number,
          jurorsNumber,
        })),
      },
    },
  }
}

export const removeJurorCircularReferences = juror => {
  if (!juror) {
    return
  }

  return {
    ...juror,
    drafts: juror.drafts.map(jurorDraft => ({
      ...jurorDraft,
      round: removeRoundCircularReferences(jurorDraft.round),
      juror: { id: jurorDraft.id },
    })),
  }
}

export const removeRoundCircularReferences = round => {
  const { jurors = [], dispute } = round || {}

  return {
    ...round,
    appeal: round.appeal
      ? {
          ...round.appeal,
          round: {
            id: round.id,
          },
        }
      : null,
    dispute: {
      ...dispute,
      rounds: dispute.rounds.map(round => ({ id: round.id })),
    },
    jurors: jurors.map(jurorDraft => ({
      ...jurorDraft,
      juror: { id: jurorDraft.juror.id },
      round: { id: jurorDraft.round.id },
    })),
  }
}
