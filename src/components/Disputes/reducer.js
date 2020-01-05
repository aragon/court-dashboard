import * as DisputesTypes from './types'
import { toDate } from '../../lib/web3'
import dayjs from '../../lib/dayjs'

export const reduceDispute = (dispute, courtSettings) => {
  return {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    reducedState:
      dispute.state === DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
  }
}

export function getPhaseAndTransition(dispute, courtSettings, now) {
  const { createTermId, state } = dispute
  const { termDuration, terms, evidenceTerms } = courtSettings
  const disputeCreateTerm = terms.find(term => term.id === createTermId)
  const disputeCreateDateTime = toDate(disputeCreateTerm.startTime)
  const evidenceTermsNumeric = parseInt(evidenceTerms)
  const termDurationNumeric = parseInt(termDuration)

  let currentPhase
  let nextTransition

  if (state === DisputesTypes.Phase.Evidence) {
    const evidenceSubmissionEndTime = dayjs(disputeCreateDateTime).add(
      termDurationNumeric * evidenceTermsNumeric,
      'second'
    )

    if (dayjs(now).isAfter(dayjs(evidenceSubmissionEndTime))) {
      currentPhase = DisputesTypes.Phase.JuryDrafting
      nextTransition = null
    } else {
      currentPhase = DisputesTypes.Phase.Evidence
      nextTransition = evidenceSubmissionEndTime
    }
    return { currentPhase, nextTransition }
  }

  if (state === DisputesTypes.Phase.JuryDrafting) {
    currentPhase = DisputesTypes.Phase.JuryDrafting
    // There is no end time for juty drafting?
    nextTransition = null
    return { currentPhase, nextTransition }
  }

  if (state === DisputesTypes.Phase.Adjudicating) {
    const { draftTermId, appeal } = dispute.rounds[dispute.rounds.length - 1]
    const disputeDraftTerm = terms.find(term => term.id === draftTermId)

    const disputeDraftTermDateTime = toDate(disputeDraftTerm.startTime)

    const roundPhaseAndTime = getRoundPhasesAndTime(
      courtSettings,
      disputeDraftTermDateTime
    )

    const phaseIndex = roundPhaseAndTime.findIndex(p =>
      dayjs(now).isBefore(dayjs(p.endTime))
    )

    // If i can not find the phase it means that the round has ended
    if (phaseIndex !== -1) {
      return {
        currentPhase: roundPhaseAndTime[phaseIndex].phase,
        nextTransition: roundPhaseAndTime[phaseIndex].endTime,
      }
    }

    // If could't find the phase and it has no appeal it means that the juror can claim the rewards?
    if (!appeal) {
      return {
        currentPhase: DisputesTypes.Phase.ClaimRewards,
        nextTransition: null,
      }
    }

    // What happen if there are appeals? there is a new round?
  }
}

function getRoundPhasesAndTime(courtSettings, disputeDraftTermDateTime) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtSettings

  const commitTermsNumeric = parseInt(commitTerms)
  const termDurationNumeric = parseInt(termDuration)
  const revealTermsNumeric = parseInt(revealTerms)
  const appealTermsNumeric = parseInt(appealTerms)
  const appealConfirmationTermsNumeric = parseInt(appealConfirmationTerms)

  return [
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDurationNumeric * commitTermsNumeric,
        'second'
      ),
    },
    {
      phase: DisputesTypes.Phase.RevealVote,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDurationNumeric * (commitTermsNumeric + revealTermsNumeric),
        'second'
      ),
    },
    {
      phase: DisputesTypes.Phase.AppealRuling,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDurationNumeric *
          (commitTermsNumeric + revealTermsNumeric + appealTermsNumeric),
        'second'
      ),
    },
    {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDurationNumeric *
          (commitTermsNumeric +
            revealTermsNumeric +
            appealTermsNumeric +
            appealConfirmationTermsNumeric),
        'second'
      ),
    },
  ]
}
