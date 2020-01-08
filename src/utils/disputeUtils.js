import { getTermStartDate } from './courtUtils'
import { toDate } from '../lib/web3'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/types'

const juryDraftingTerms = 3

export function getDisputeTimeLine(dispute, courtSettings) {
  const { createTermId, state, lastRoundId } = dispute
  const disputeCreationDate = getTermStartDate(createTermId)
  const { termDuration, terms, evidenceTerms } = courtSettings
  const roundPhases = [
    DisputesTypes.Phase.JuryDrafting,
    DisputesTypes.Phase.VotingPeriod,
    DisputesTypes.Phase.RevealVote,
    DisputesTypes.Phase.AppealRuling,
    DisputesTypes.Phase.ConfirmAppeal,
  ]

  const disputeStartDate = getTermStartDate(createTermId)
  const currentPhase = getPhaseAndTransition(dispute, courtSettings, new Date())

  const timeLine = {
    created: {
      phase: 'Dispute Created', // create Symbol
      endTime: disputeCreationDate,
    },
    evidence: {
      phase: DisputesTypes.Phase.Evidence,
      endTime: dayjs(disputeStartDate).add(
        termDuration * evidenceTerms,
        'second'
      ),
      active: currentPhase.currentPhase === DisputesTypes.Phase.Evidence,
    },
    rounds: [],
  }
  // Check if the dispute phase is included on roundPhases array and use getRoundPhasesAndTime function to get the end date of each one iterating by rounds
}

export function getPhaseAndTransition(dispute, courtSettings, now) {
  const { createTermId, state } = dispute
  const { termDuration, terms, evidenceTerms } = courtSettings
  const disputeCreateTerm = terms.find(term => term.id === createTermId)
  const disputeCreateDateTime = toDate(disputeCreateTerm.startTime)

  let currentPhase
  let nextTransition

  if (state === DisputesTypes.Phase.Evidence) {
    const evidenceSubmissionEndTime = dayjs(disputeCreateDateTime).add(
      termDuration * evidenceTerms,
      'second'
    )

    if (dayjs(now).isAfter(dayjs(evidenceSubmissionEndTime))) {
      currentPhase = DisputesTypes.Phase.JuryDrafting
      nextTransition = dayjs(evidenceSubmissionEndTime).add(
        termDuration * juryDraftingTerms,
        'second'
      )
    } else {
      currentPhase = DisputesTypes.Phase.Evidence
      nextTransition = evidenceSubmissionEndTime
    }
    return { currentPhase, nextTransition }
  }

  if (state === DisputesTypes.Phase.JuryDrafting) {
    currentPhase = DisputesTypes.Phase.JuryDrafting
    // There is no end time for juty drafting?
    nextTransition = dayjs(disputeCreateDateTime).add(
      termDuration * (evidenceTerms + juryDraftingTerms),
      'second'
    )
    return { currentPhase, nextTransition }
  }

  if (state === DisputesTypes.Phase.Adjudicating) {
    const { draftTermId, appeal } = dispute.rounds[dispute.rounds.length - 1]

    const disputeDraftTermDateTime = getTermStartDate(
      draftTermId,
      courtSettings
    )

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

  return [
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDuration * commitTerms,
        'second'
      ),
    },
    {
      phase: DisputesTypes.Phase.RevealVote,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDuration * (commitTerms + revealTerms),
        'second'
      ),
    },
    {
      phase: DisputesTypes.Phase.AppealRuling,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDuration * (commitTerms + revealTerms + appealTerms),
        'second'
      ),
    },
    {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime: dayjs(disputeDraftTermDateTime).add(
        termDuration *
          (commitTerms + revealTerms + appealTerms + appealConfirmationTerms),
        'second'
      ),
    },
  ]
}
