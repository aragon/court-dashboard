import { getTermStartTime } from './courtUtils'
// import { toDate } from '../lib/web3'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/types'

const juryDraftingTerms = 3

export function getDisputeTimeLine(dispute, courtSettings) {
  const { createdAt } = dispute
  const { termDuration, evidenceTerms } = courtSettings

  const phaseAndTime = getPhaseAndTransition(dispute, courtSettings, new Date())

  const timeLine = {
    created: {
      phase: 'Dispute Created', // create Symbol
      endTime: createdAt,
    },
    evidence: {
      phase: DisputesTypes.Phase.Evidence,
      endTime: createdAt + termDuration * evidenceTerms,
      active: phaseAndTime.currentPhase === DisputesTypes.Phase.Evidence,
    },
    rounds: dispute.rounds.map(round =>
      getRoundPhasesAndTime(courtSettings, round, phaseAndTime)
    ),
  }
  return timeLine
}

export function getPhaseAndTransition(dispute, courtSettings, nowDate) {
  const { state, createdAt } = dispute
  const now = dayjs(nowDate).unix() * 1000

  let currentPhase
  let nextTransition

  // Ruled
  if (state === DisputesTypes.Phase.Ruled) {
    currentPhase = DisputesTypes.Phase.ClaimRewards
    const ruling = null // TODO: calculate ruling
    return { currentPhase, ruling }
  }

  const { termDuration, evidenceTerms } = courtSettings

  // Evidence submission
  if (state === DisputesTypes.Phase.Evidence) {
    const evidenceSubmissionEndTime = createdAt + termDuration * evidenceTerms

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

function getRoundPhasesAndTime(courtSettings, round, currentPhase) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtSettings

  const { draftTermId, delayedTerms, number: roundId, createdAt } = round

  const disputeDraftTermTime = getTermStartTime(
    draftTermId + delayedTerms,
    courtSettings
  )

  const roundPhasesAndTime = [
    {
      phase: DisputesTypes.Phase.JuryDrafting,
      endTime: createdAt + termDuration * juryDraftingTerms,
      active: DisputesTypes.Phase.JuryDrafting === currentPhase.currentPhase,
    },
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: disputeDraftTermTime + termDuration * commitTerms,
      active: DisputesTypes.Phase.VotingPeriod === currentPhase.currentPhase,
    },
    {
      phase: DisputesTypes.Phase.RevealVote,
      endTime:
        disputeDraftTermTime + termDuration * (commitTerms + revealTerms),
      active: DisputesTypes.Phase.RevealVote === currentPhase.currentPhase,
    },
    {
      phase: DisputesTypes.Phase.AppealRuling,
      endTime:
        disputeDraftTermTime +
        termDuration * (commitTerms + revealTerms + appealTerms),
      active: DisputesTypes.Phase.AppealRuling === currentPhase.currentPhase,
    },
    {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime:
        disputeDraftTermTime +
        termDuration *
          (commitTerms + revealTerms + appealTerms + appealConfirmationTerms),
      active: DisputesTypes.Phase.ConfirmAppeal === currentPhase.currentPhase,
    },
  ]

  return roundId < currentPhase.roundId
    ? roundPhasesAndTime
    : roundPhasesAndTime.slice(0, 4)
}
