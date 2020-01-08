import { getTermStartTime } from './courtUtils'
import { toDate } from '../lib/web3'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/types'

const juryDraftingTerms = 3

export function getDisputeTimeLine(dispute, courtSettings) {
  const { createTermId, state, lastRoundId } = dispute
  const disputeCreationDate = getTermStartTime(createTermId)
  const { termDuration, terms, evidenceTerms } = courtSettings
  const roundPhases = [
    DisputesTypes.Phase.JuryDrafting,
    DisputesTypes.Phase.VotingPeriod,
    DisputesTypes.Phase.RevealVote,
    DisputesTypes.Phase.AppealRuling,
    DisputesTypes.Phase.ConfirmAppeal,
  ]

  const disputeStartTime = getTermStartTime(createTermId)
  const currentPhase = getPhaseAndTransition(dispute, courtSettings, new Date())

  const timeLine = {
    created: {
      phase: 'Dispute Created', // create Symbol
      endTime: disputeCreationDate,
    },
    evidence: {
      phase: DisputesTypes.Phase.Evidence,
      endTime: disputeStartTime + termDuration * evidenceTerms,
      active: currentPhase.currentPhase === DisputesTypes.Phase.Evidence,
    },
    // rounds: dispute.rounds.map(round => ),
  }
  // Check if the dispute phase is included on roundPhases array and use getRoundPhasesAndTime function to get the end date of each one iterating by rounds
}

export function getPhaseAndTransition(dispute, courtSettings, nowDate) {
  const { createTermId, state } = dispute

  const now = dayjs(nowDate).unix()

  let currentPhase
  let nextTransition

  // Ruled
  if (state === DisputesTypes.Phase.Ruled) {
    currentPhase = DisputesTypes.Phase.ClaimRewards
    const ruling = null // TODO: calculate ruling
    return { currentPhase, ruling }
  }

  const { termDuration, terms, evidenceTerms } = courtSettings
  const disputeCreateDateTime = getTermStartTime(createTermId)

  // Evidence submission
  if (state === DisputesTypes.Phase.Evidence) {
    const evidenceSubmissionEndTime =
      disputeCreateDateTime + termDuration * evidenceTerms

    if (now > evidenceSubmissionEndTime) {
      currentPhase = DisputesTypes.Phase.JuryDrafting
      nextTransition =
        evidenceSubmissionEndTime + termDuration * juryDraftingTerms
    } else {
      currentPhase = state
      nextTransition = evidenceSubmissionEndTime
    }
    return { currentPhase, nextTransition }
  }

  const lastRound = dispute.rounds[dispute.lastRoundId]

  // Jury Drafting
  if (state === DisputesTypes.Phase.JuryDrafting) {
    currentPhase = DisputesTypes.Phase.JuryDrafting
    // There is no end time for juty drafting?

    const { createdAt } = lastRound
    nextTransition = createdAt + termDuration * juryDraftingTerms
    return { currentPhase, nextTransition }
  }

  // Adjudicating
  if (state === DisputesTypes.Phase.Adjudicating) {
    const { id, draftTermId, delayedTerms } = lastRound

    const draftTermEndTime = getTermStartTime(
      draftTermId + delayedTerms,
      courtSettings
    )

    const currentAdjudicationPhase = getAdjudicationPhase(
      dispute,
      lastRound,
      now,
      draftTermEndTime,
      courtSettings
    )

    return { ...currentAdjudicationPhase, roundId: id }
  }
}

function getAdjudicationPhase(
  dispute,
  round,
  now,
  draftTermEndTime,
  courtSettings
) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmTerms,
    maxRegularAppealRounds,
  } = courtSettings
  const numberOfRounds = dispute.rounds.length

  // If given term is before the reveal start term of the last round, then jurors are still allowed to commit votes for the last round
  const revealTermStartTime = draftTermEndTime + commitTerms * termDuration
  if (now < revealTermStartTime) {
    return {
      phase: DisputesTypes.Phase.VotingPeriod,
      nextTransition: revealTermStartTime,
    }
  }

  // If given term is before the appeal start term of the last round, then jurors are still allowed to reveal votes for the last round
  const appealTermStartTime = revealTermStartTime + revealTerms * termDuration
  if (now < appealTermStartTime) {
    return {
      phase: DisputesTypes.Phase.RevealVote,
      nextTransition: appealTermStartTime,
    }
  }

  // If the max number of appeals has been reached, then the last round is the final round and can be considered ended
  const maxAppealReached = numberOfRounds > maxRegularAppealRounds
  if (maxAppealReached) {
    return { phase: DisputesTypes.Phase.Ended }
  }

  // If the last round was not appealed yet, check if the confirmation period has started or not
  const isLastRoundAppealed = !!round.appeal
  const appealConfirmationTermStartTime =
    appealTermStartTime + appealTerms * termDuration

  if (!isLastRoundAppealed) {
    // If given term is before the appeal confirmation start term, then the last round can still be appealed. Otherwise, it is ended.
    if (now < appealConfirmationTermStartTime) {
      return {
        phase: DisputesTypes.Phase.Appealing,
        nextTransition: appealConfirmationTermStartTime,
      }
    } else {
      return { phase: DisputesTypes.Phase.Ended }
    }
  }

  // If the last round was appealed and the given term is before the appeal confirmation end term, then the last round appeal can still be
  // confirmed. Note that if the round being checked was already appealed and confirmed, it won't be the last round, thus it will be caught
  // above by the first check and considered 'Ended'.
  const appealConfirmationTermEndTime =
    appealConfirmationTermStartTime + appealConfirmTerms * termDuration

  if (now < appealConfirmationTermEndTime) {
    return {
      phase: DisputesTypes.Phase.ConfirmingAppeal,
      nextTransition: appealConfirmationTermEndTime,
    }
  }

  // If non of the above conditions have been met, the last round is considered ended
  return { phase: DisputesTypes.Phase.Ended }
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
