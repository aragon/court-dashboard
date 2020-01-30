import { getTermStartTime } from './court-utils'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/dispute-status-types'
import {
  getOutcomeNumber,
  outcomeToAppealString,
  NOBODY_APPEALED,
  NOBODY_CONFIRMED,
  OUTCOMES,
  outcomeToString,
} from './crvoting-utils'

const juryDraftingTerms = 3

export const transformResponseDisputeAttributes = dispute => {
  return {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    reducedState:
      dispute.state === DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
    isOpen:
      DisputesTypes.convertFromString(dispute.state) !==
      DisputesTypes.Phase.Ruled,
    rounds: dispute.rounds.map(round => {
      const { vote, appeal } = round

      return {
        ...round,
        createdAt: parseInt(round.createdAt, 10) * 1000,
        draftTermId: parseInt(round.draftTermId, 10),
        delayedTerms: parseInt(round.delayedTerms, 10),
        number: parseInt(round.number),
        jurors: round.jurors.map(juror => ({
          ...juror,
          weight: parseInt(juror.weight, 10),
        })),
        vote: vote
          ? {
              ...vote,
              winningOutcome: getOutcomeNumber(vote.winningOutcome),
            }
          : null,
        appeal: appeal
          ? {
              ...appeal,
              appealedRuling: parseInt(appeal.appealedRuling, 10),
              opposedRuling: parseInt(appeal.opposedRuling, 10),
            }
          : null,
        state: DisputesTypes.convertFromString(round.state),
      }
    }),
  }
}

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
      phase: DisputesTypes.Phase.Evidence,
      endTime: createdAt + termDuration * evidenceTerms,
      active: currentPhaseAndTime.phase === DisputesTypes.Phase.Evidence,
      roundId: 0,
    },
    {
      phase: DisputesTypes.Phase.Created, // create Symbol
      endTime: createdAt,
    },
  ]

  const rounds = []
  dispute.rounds.forEach(round => {
    const roundPhases = getRoundPhasesAndTime(
      courtConfig,
      round,
      currentPhaseAndTime
    )
    rounds.unshift([...roundPhases].reverse())
  })

  if (rounds.length === 0) {
    return timeLine
  }

  timeLine.unshift(rounds)

  if (
    currentPhaseAndTime.phase === DisputesTypes.Phase.ExecuteRuling ||
    currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards
  ) {
    timeLine.unshift({
      phase: DisputesTypes.Phase.ExecuteRuling,
      active: DisputesTypes.Phase.ExecuteRuling === currentPhaseAndTime.phase,
      roundId: currentPhaseAndTime.roundId,
    })
  }

  if (currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards) {
    timeLine.unshift({
      phase: DisputesTypes.Phase.ClaimRewards,
      active: currentPhaseAndTime.phase === DisputesTypes.Phase.ClaimRewards,
    })
  }

  return timeLine
}

export function getPhaseAndTransition(dispute, courtConfig, nowDate) {
  if (!dispute) return null

  const { state, createdAt } = dispute
  const now = dayjs(nowDate)
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
    let phase
    // There is no end time for juty drafting?

    const { createdAt } = lastRound
    const juryDraftingStartTime = getTermStartTime(
      lastRound.draftTermId,
      courtConfig
    )

    // When a new round is created, it could happen that the draft term has not been reached yet
    if (now < juryDraftingStartTime) {
      phase = DisputesTypes.Phase.NotStarted
      nextTransition = juryDraftingStartTime
    } else {
      phase = DisputesTypes.Phase.JuryDrafting
      nextTransition = createdAt + termDuration * juryDraftingTerms
    }
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
    appealConfirmationTerms,
    maxRegularAppealRounds,
  } = courtConfig
  const numberOfRounds = dispute.rounds.length
  const { draftTermId, delayedTerms, number: roundId } = round

  const drafTermStartTime = getTermStartTime(draftTermId, courtConfig)

  if (
    DisputesTypes.Phase[round.state] === DisputesTypes.Phase.Invalid &&
    now < drafTermStartTime
  ) {
    return {
      phase: DisputesTypes.Phase.Invalid,
      nextTransition: drafTermStartTime,
      roundId,
    }
  }

  const draftTermEndTime = drafTermStartTime + delayedTerms * termDuration

  // If given term is before the reveal start term of the last round, then jurors are still allowed to commit votes for the last round
  const revealTermStartTime = draftTermEndTime + commitTerms * termDuration
  if (now < revealTermStartTime) {
    return {
      phase: DisputesTypes.Phase.VotingPeriod,
      nextTransition: revealTermStartTime,
      roundId,
    }
  }

  // If given term is before the appeal start term of the last round, then jurors are still allowed to reveal votes for the last round
  const appealTermStartTime = revealTermStartTime + revealTerms * termDuration
  if (now < appealTermStartTime) {
    return {
      phase: DisputesTypes.Phase.RevealVote,
      nextTransition: appealTermStartTime,
      roundId,
    }
  }

  // If the max number of appeals has been reached, then the last round is the final round and can be considered ended
  const maxAppealReached = numberOfRounds > maxRegularAppealRounds
  if (maxAppealReached) {
    return { phase: DisputesTypes.Phase.Ended, maxAppealReached: true, roundId }
  }

  // If the last round was not appealed yet, check if the confirmation period has started or not
  const isLastRoundAppealed =
    !!round.appeal && round.appeal.appealedRuling !== 0
  const appealConfirmationTermStartTime =
    appealTermStartTime + appealTerms * termDuration

  if (!isLastRoundAppealed) {
    // If given term is before the appeal confirmation start term, then the last round can still be appealed. Otherwise, it is ended.
    if (now < appealConfirmationTermStartTime) {
      return {
        phase: DisputesTypes.Phase.AppealRuling,
        nextTransition: appealConfirmationTermStartTime,
        roundId,
      }
    } else {
      return {
        phase: DisputesTypes.Phase.Ended,
        appealed: false,
        roundId,
      }
    }
  }

  // If the last round was appealed and the given term is before the appeal confirmation end term, then the last round appeal can still be
  // confirmed. Note that if the round being checked was already appealed and confirmed, it won't be the last round, thus it will be caught
  // above by the first check and considered 'Ended'.
  const appealConfirmationTermEndTime =
    appealConfirmationTermStartTime + appealConfirmationTerms * termDuration

  if (now < appealConfirmationTermEndTime) {
    return {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      nextTransition: appealConfirmationTermEndTime,
      roundId,
    }
  }

  // If non of the above conditions have been met, the last round is considered ended
  return {
    phase: DisputesTypes.Phase.Ended,
    appealed: true,
    roundId,
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

  const {
    draftTermId,
    delayedTerms,
    number: roundId,
    createdAt,
    vote,
    appeal,
  } = round
  const isCurrentRound = roundId === currentPhase.roundId
  const { winningOutcome } = vote || {}

  const disputeDraftStartTime = getTermStartTime(draftTermId, courtConfig)

  // Case where we are in a next round and has not yet started
  if (isCurrentRound && currentPhase.phase === DisputesTypes.Phase.NotStarted) {
    return [
      {
        phase: DisputesTypes.Phase.NotStarted,
        endTime: disputeDraftStartTime,
        roundId,
        active: true,
      },
    ]
  }

  const disputeDraftTermEndTime =
    disputeDraftStartTime + delayedTerms * termDuration

  const revealEndTime =
    disputeDraftTermEndTime + termDuration * (commitTerms + revealTerms)

  const appealEndTime = revealEndTime + termDuration * appealTerms
<<<<<<< HEAD
  const confirmEndTime = appealEndTime + termDuration * appealConfirmationTerms
=======
  const confirmAppealEndTime =
    appealEndTime + termDuration * appealConfirmationTerms
>>>>>>> dispute-interactions

  const roundPhasesAndTime = [
    {
      phase: DisputesTypes.Phase.JuryDrafting,
      endTime: createdAt + termDuration * juryDraftingTerms,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.JuryDrafting === currentPhase.phase,
      roundId,
    },
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: disputeDraftTermEndTime + termDuration * commitTerms,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.VotingPeriod === currentPhase.phase,
      roundId,
    },
    {
      phase: DisputesTypes.Phase.RevealVote,
      endTime: revealEndTime,
      active:
        isCurrentRound && DisputesTypes.Phase.RevealVote === currentPhase.phase,
      roundId,
<<<<<<< HEAD
      outcome: dayjs(new Date()).isAfter(revealEndTime)
        ? outcomeToString(winningOutcome)
        : null,
=======
      outcome: winningOutcome,
      showOutcome: dayjs(new Date()).isAfter(revealEndTime),
>>>>>>> dispute-interactions
    },
    {
      phase: DisputesTypes.Phase.AppealRuling,
      endTime: appealEndTime,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.AppealRuling === currentPhase.phase,
      roundId,
<<<<<<< HEAD
      outcome: getAppealOutcome(appeal, appealEndTime),
    },
    {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime: confirmEndTime,
=======
      outcome: appeal ? appeal.appealedRuling : null,
      showOutcome: dayjs(new Date()).isAfter(appealEndTime),
    },
    {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime: confirmAppealEndTime,
>>>>>>> dispute-interactions
      active:
        isCurrentRound &&
        DisputesTypes.Phase.ConfirmAppeal === currentPhase.phase,
      roundId,
<<<<<<< HEAD
      outcome: getConfirmAppealOutcome(appeal, confirmEndTime),
=======
      outcome: appeal ? appeal.opposedRuling : null,
      showOutcome: dayjs(new Date()).isAfter(confirmAppealEndTime),
>>>>>>> dispute-interactions
    },
  ]

  if (roundId < currentPhase.roundId) {
    return roundPhasesAndTime
  }

  if (
    currentPhase.phase === DisputesTypes.Phase.ExecuteRuling ||
    currentPhase.phase === DisputesTypes.Phase.ClaimRewards
  ) {
    // It is the last possible round the last phase of the round is Reveal or If it was not appealed not show the Confirm appeal
    if (currentPhase.maxAppealReached || !currentPhase.appealed) {
      return roundPhasesAndTime.slice(0, 4)
    }

    // round ended What happen if the appeal is not confirmed?
    if (currentPhase.appealed === true) {
      return roundPhasesAndTime
    }
  }

  const currentPhaseIndex = roundPhasesAndTime.findIndex(
    phase => phase.phase === currentPhase.phase
  )

  return roundPhasesAndTime.slice(0, currentPhaseIndex + 1)
}

function getAppealOutcome(appeal, appealEndTime) {
  const { appealedRuling } = appeal || {}
  if (appeal) {
    return outcomeToAppealString(appealedRuling)
  }

  if (dayjs(new Date()).isAfter(appealEndTime)) {
    return NOBODY_APPEALED
  }
  return null
}

function getConfirmAppealOutcome(appeal, confirmAppealEndTime) {
  const { opposedRuling } = appeal || {}
  if (appeal) {
    if (opposedRuling !== OUTCOMES.Missing) {
      return outcomeToAppealString(opposedRuling)
    }

    if (dayjs(new Date()).isAfter(confirmAppealEndTime)) {
      return NOBODY_CONFIRMED
    }
  }
  return null
}

export function getCommitEndTime(round, courtConfig) {
  const { termDuration, commitTerms } = courtConfig

  const { draftTermId, delayedTerms } = round

  const disputeDraftTermTime = getTermStartTime(
    draftTermId + delayedTerms,
    courtConfig
  )
  return disputeDraftTermTime + termDuration * commitTerms
}

export function getRevealEndTime(round, courtConfig) {
  const { termDuration, revealTerms } = courtConfig
  const commitEndTime = getCommitEndTime(round, courtConfig)

  return commitEndTime + revealTerms * termDuration
}

export function getDisputeLastRound(dispute) {
  return dispute.rounds[dispute.lastRoundId]
}
