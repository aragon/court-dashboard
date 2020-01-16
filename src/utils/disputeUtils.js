import { getTermStartTime } from './courtUtils'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/types'

const juryDraftingTerms = 3

export function getDisputeTimeLine(dispute, courtSettings) {
  const { createdAt } = dispute
  const { termDuration, evidenceTerms } = courtSettings

  const currentPhaseAndTime = getPhaseAndTransition(
    dispute,
    courtSettings,
    new Date()
  )

  const timeLine = [
    {
      phase: DisputesTypes.Phase.Created, // create Symbol
      endTime: createdAt,
    },
    {
      phase: DisputesTypes.Phase.Evidence,
      endTime: createdAt + termDuration * evidenceTerms,
      active: currentPhaseAndTime.phase === DisputesTypes.Phase.Evidence,
    },
  ]
  const rounds = dispute.rounds.map(round =>
    getRoundPhasesAndTime(courtSettings, round, currentPhaseAndTime)
  )
  if (rounds.length === 0) {
    return timeLine
  }

  timeLine.push(rounds)

  if (DisputesTypes.Phase.ExecuteRuling === currentPhaseAndTime.phase) {
    timeLine.push({
      phase: DisputesTypes.Phase.ExecuteRuling,
      active: DisputesTypes.Phase.ExecuteRuling === currentPhaseAndTime.phase,
      roundId: currentPhaseAndTime.roundId,
    })
    return timeLine
  }

  if (
    DisputesTypes.Phase.ClaimRewards === currentPhaseAndTime.phase.ClaimRewards
  ) {
    timeLine.push({
      phase: DisputesTypes.Phase.ClaimRewards,
      active: currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards,
      roundId: currentPhaseAndTime.roundId,
    })
    return timeLine
  }

  return timeLine
}

export function getPhaseAndTransition(dispute, courtSettings, nowDate) {
  const { state, createdAt } = dispute
  const now = dayjs(nowDate).unix() * 1000

  let phase
  let nextTransition
  const lastRound = dispute.rounds[dispute.lastRoundId]
  const { number } = lastRound

  // Ruled
  if (state === DisputesTypes.Phase.Ruled) {
    phase = DisputesTypes.Phase.ClaimRewards
    const ruling = null // TODO: calculate ruling
    return { phase, ruling, roundId: number }
  }

  const { termDuration, evidenceTerms } = courtSettings

  // Evidence submission
  if (state === DisputesTypes.Phase.Evidence) {
    const evidenceSubmissionEndTime = createdAt + termDuration * evidenceTerms

    if (now > evidenceSubmissionEndTime) {
      phase = DisputesTypes.Phase.JuryDrafting
      nextTransition =
        evidenceSubmissionEndTime + termDuration * juryDraftingTerms
    } else {
      phase = state
      nextTransition = evidenceSubmissionEndTime
    }

    return { phase, nextTransition, roundId: number }
  }

  // Jury Drafting
  if (state === DisputesTypes.Phase.JuryDrafting) {
    phase = DisputesTypes.Phase.JuryDrafting
    // There is no end time for juty drafting?

    const { createdAt } = lastRound
    nextTransition = createdAt + termDuration * juryDraftingTerms
    return { phase, nextTransition, roundId: number }
  }

  // Adjudicating
  if (state === DisputesTypes.Phase.Adjudicating) {
    const currentAdjudicationPhase = getAdjudicationPhase(
      dispute,
      lastRound,
      now,
      courtSettings
    )
    return { ...currentAdjudicationPhase, roundId: number }
  }
}

export function getAdjudicationPhase(dispute, round, now, courtSettings) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmTerms,
    maxRegularAppealRounds,
  } = courtSettings
  const numberOfRounds = dispute.rounds.length
  const { draftTermId, delayedTerms } = round

  const draftTermEndTime = getTermStartTime(
    parseInt(draftTermId) + parseInt(delayedTerms),
    courtSettings
  )

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
    return { phase: DisputesTypes.Phase.ExecuteRuling }
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
      return { phase: DisputesTypes.Phase.ExecuteRuling }
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
  return { phase: DisputesTypes.Phase.ExecuteRuling }
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
    parseInt(draftTermId) + parseInt(delayedTerms),
    courtSettings
  )

  const roundPhasesAndTime = [
    {
      phase: DisputesTypes.Phase.JuryDrafting,
      endTime: createdAt + termDuration * juryDraftingTerms,
      active: DisputesTypes.Phase.JuryDrafting === currentPhase.phase,
      roundId: roundId,
    },
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: disputeDraftTermTime + termDuration * commitTerms,
      active: DisputesTypes.Phase.VotingPeriod === currentPhase.phase,
      roundId: roundId,
    },
    {
      phase: DisputesTypes.Phase.RevealVote,
      endTime:
        disputeDraftTermTime + termDuration * (commitTerms + revealTerms),
      active: DisputesTypes.Phase.RevealVote === currentPhase.phase,
      roundId: roundId,
    },
    {
      phase: DisputesTypes.Phase.AppealRuling,
      endTime:
        disputeDraftTermTime +
        termDuration * (commitTerms + revealTerms + appealTerms),
      active: DisputesTypes.Phase.AppealRuling === currentPhase.phase,
      roundId: roundId,
    },
    {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime:
        disputeDraftTermTime +
        termDuration *
          (commitTerms + revealTerms + appealTerms + appealConfirmationTerms),
      active: DisputesTypes.Phase.ConfirmAppeal === currentPhase.phase,
      roundId: roundId,
    },
  ]
  const currentPhaseIndex = roundPhasesAndTime.findIndex(
    phase => phase.phase === currentPhase.phase
  )

  if (roundId < currentPhase.roundId || currentPhaseIndex === -1) {
    return roundPhasesAndTime
  }

  return roundPhasesAndTime.slice(0, currentPhaseIndex + 1)
}

export function getCommitEndTime(round, courtSettings) {
  const { termDuration, commitTerms } = courtSettings

  const { draftTermId, delayedTerms } = round

  const disputeDraftTermTime = getTermStartTime(
    parseInt(draftTermId) + parseInt(delayedTerms),
    courtSettings
  )
  return disputeDraftTermTime + termDuration * commitTerms
}

export function getRevealEndTime(round, courtSettings) {
  const { termDuration, revealTerms } = courtSettings
  const commitEndTime = getCommitEndTime(round, courtSettings)

  return commitEndTime + revealTerms * termDuration
}
