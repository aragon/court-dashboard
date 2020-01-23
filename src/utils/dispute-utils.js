import { getTermStartTime } from './court-utils'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/types'

const juryDraftingTerms = 3

export function getDisputeTimeLine(dispute, courtConfig) {
  const { createdAt } = dispute
  const { termDuration, evidenceTerms } = courtConfig

  const currentPhaseAndTime = getPhaseAndTransition(
    dispute,
    courtConfig,
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

  // if (
  //   currentPhaseAndTime.phase === DisputesTypes.Phase.Adjudicating ||
  //   currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards ||
  //   currentPhaseAndTime.phase === DisputesTypes.Phase.JuryDrafting ||
  //   currentPhaseAndTime.phase === DisputesTypes.Phase.ExecuteRuling
  // ) {
  const rounds = dispute.rounds.map(round =>
    getRoundPhasesAndTime(courtConfig, round, currentPhaseAndTime)
  )
  if (rounds.length === 0) {
    return timeLine
  }

  timeLine.push(rounds)
  // }

  if (currentPhaseAndTime.phase === DisputesTypes.Phase.ExecuteRuling) {
    timeLine.push({
      phase: DisputesTypes.Phase.ExecuteRuling,
      active: DisputesTypes.Phase.ExecuteRuling === currentPhaseAndTime.phase,
      roundId: currentPhaseAndTime.roundId,
    })
    return timeLine
  }

  if (currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards) {
    timeLine.push({
      phase: DisputesTypes.Phase.ClaimRewards,
      active: currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards,
      roundId: currentPhaseAndTime.roundId,
    })
    return timeLine
  }

  return timeLine
}

export function getPhaseAndTransition(dispute, courtConfig, nowDate) {
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

  const { termDuration, evidenceTerms } = courtConfig

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
    let currentAdjudicationPhase = getAdjudicationPhase(
      dispute,
      lastRound,
      now,
      courtConfig
    )
    if (currentAdjudicationPhase.phase === DisputesTypes.Phase.Ended) {
      currentAdjudicationPhase = {
        ...currentAdjudicationPhase,
        phase: DisputesTypes.Phase.ExecuteRuling,
      }
    }
    return { ...currentAdjudicationPhase, roundId: number }
  }
}

export function getAdjudicationPhase(dispute, round, now, courtConfig) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmTerms,
    maxRegularAppealRounds,
  } = courtConfig
  const numberOfRounds = dispute.rounds.length
  const { draftTermId, delayedTerms } = round

  const draftTermEndTime = getTermStartTime(
    parseInt(draftTermId) + parseInt(delayedTerms),
    courtConfig
  )

  console.log('draftTermEndTime ', draftTermEndTime)

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
    return { phase: DisputesTypes.Phase.Ended, maxAppealReached: true }
  }

  // If the last round was not appealed yet, check if the confirmation period has started or not
  const isLastRoundAppealed = !!round.appeal
  const appealConfirmationTermStartTime =
    appealTermStartTime + appealTerms * termDuration

  if (!isLastRoundAppealed) {
    // If given term is before the appeal confirmation start term, then the last round can still be appealed. Otherwise, it is ended.
    if (now < appealConfirmationTermStartTime) {
      return {
        phase: DisputesTypes.Phase.AppealRuling,
        nextTransition: appealConfirmationTermStartTime,
      }
    } else {
      return {
        phase: DisputesTypes.Phase.Ended,
        appealed: false,
      }
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
  return {
    phase: DisputesTypes.Phase.Ended,
    appealed: true,
  }
}

function getRoundPhasesAndTime(courtConfig, round, currentPhase) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtConfig

  const { draftTermId, delayedTerms, number: roundId, createdAt } = round

  const disputeDraftTermTime = getTermStartTime(
    parseInt(draftTermId) + parseInt(delayedTerms),
    courtConfig
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

  if (roundId < currentPhase.roundId) {
    return roundPhasesAndTime
  }

  if (currentPhase.phase === DisputesTypes.Phase.ExecuteRuling) {
    // It is the last possible round the last phase of the round is Reveal
    if (currentPhase.maxAppealReached === true) {
      return roundPhasesAndTime.slice(0, 4)
    }
    // If it was not appealed not show the Confirm appeal
    if (currentPhase.appealed === false) {
      return roundPhasesAndTime.slice(0, 4)
    }
    // round ended What happen if the appeal is not confirmed?
    if (currentPhase.appealed === true) {
      return roundPhasesAndTime
    }
  }

  return roundPhasesAndTime.slice(0, currentPhaseIndex + 1)
}

export function getCommitEndTime(round, courtConfig) {
  const { termDuration, commitTerms } = courtConfig

  const { draftTermId, delayedTerms } = round

  const disputeDraftTermTime = getTermStartTime(
    parseInt(draftTermId) + parseInt(delayedTerms),
    courtConfig
  )
  return disputeDraftTermTime + termDuration * commitTerms
}

export function getRevealEndTime(round, courtConfig) {
  const { termDuration, revealTerms } = courtConfig
  const commitEndTime = getCommitEndTime(round, courtConfig)

  return commitEndTime + revealTerms * termDuration
}
