import dayjs from '../lib/dayjs'

import { getTermStartTime } from './court-utils'
import * as DisputesTypes from '../types/dispute-status-types'
import { getOutcomeNumber } from './crvoting-utils'
import { bigNum } from '../lib/math-utils'
import { getVoidedDisputesByCourt } from '../voided-disputes'

export const FINAL_ROUND_WEIGHT_PRECISION = bigNum(1000)
export const PCT_BASE = bigNum(10000)

export const transformResponseDisputeAttributes = dispute => {
  const transformedDispute = {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    status:
      DisputesTypes.convertFromString(dispute.state) ===
      DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
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
          commitmentDate: parseInt(juror.commitmentDate || 0, 10) * 1000,
          revealDate: parseInt(juror.revealDate || 0, 10) * 1000,
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
              createdAt: parseInt(appeal.createdAt) * 1000,
              confirmedAt: parseInt(appeal.confirmedAt || 0) * 1000,
            }
          : null,
        state: DisputesTypes.convertFromString(round.state),
      }
    }),
  }

  // If the dispute is voided we will override certain data
  const voidedDisputes = getVoidedDisputesByCourt()
  const voidedDispute = voidedDisputes.get(dispute.id)

  return voidedDispute
    ? overrideVoidedDispute(transformedDispute, voidedDispute)
    : transformedDispute
}

function overrideVoidedDispute(dispute, voidedDispute) {
  return {
    ...dispute,
    evidences: [],
    metadata: '',
    status: DisputesTypes.Status.Voided,
    voidedDescription: voidedDispute.description,
    voidedLink: voidedDispute.link,
    voidedText: voidedDispute.text,
  }
}

/**
 * Construct dispute timeline for the given dispute
 * @param {Object} dispute The dispute to get the timeline from
 * @param {Object} courtConfig The court configuration
 * @returns {Array} The timeline of the given dispute
 */
export function getDisputeTimeLine(dispute, courtConfig) {
  const { createdAt } = dispute

  const currentPhaseAndTime = getPhaseAndTransition(
    dispute,
    courtConfig,
    new Date()
  )

  const evidenceSubmissionEndTime = getEvidenceSubmissionEndTime(
    dispute,
    courtConfig
  )

  const timeLine = [
    {
      phase: DisputesTypes.Phase.Evidence,
      endTime: evidenceSubmissionEndTime,
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
      roundId: currentPhaseAndTime.roundId,
    })
  }

  return timeLine
}

/**
 * @param {Object} dispute The dispute to query the current phase and next transition of
 * @param {Object} courtConfig The court configuration
 * @param {Date} nowDate Current date
 * @returns {Object} Current phase and next phase transition for the given dispute
 */
export function getPhaseAndTransition(dispute, courtConfig, nowDate) {
  if (!dispute) return null

  let phase
  let nextTransition
  const now = dayjs(nowDate)

  const { state } = dispute
  const lastRound = dispute.rounds[dispute.lastRoundId]
  const { number } = lastRound

  // Dispute already ruled
  if (state === DisputesTypes.Phase.Ruled) {
    phase = DisputesTypes.Phase.ClaimRewards
    return {
      phase,
      roundId: number,
      maxAppealReached: hasDisputeReachedMaxAppeals(dispute, courtConfig),
    }
  }

  // Evidence submission
  if (state === DisputesTypes.Phase.Evidence) {
    const evidenceSubmissionEndTime = getEvidenceSubmissionEndTime(
      dispute,
      courtConfig
    )

    if (now > evidenceSubmissionEndTime) {
      phase = DisputesTypes.Phase.JuryDrafting
    } else {
      phase = state
      nextTransition = evidenceSubmissionEndTime
    }
    return { phase, nextTransition, roundId: number }
  }

  // Jury Drafting phase
  if (state === DisputesTypes.Phase.JuryDrafting) {
    const drafTermStartTime = getTermStartTime(
      lastRound.draftTermId,
      courtConfig
    )

    // When a new round is created, it could happen that the draft term has not been reached yet
    // because the confirm appeal phase of the previous round has not yet ended
    if (now < drafTermStartTime) {
      phase = DisputesTypes.Phase.NotStarted
      nextTransition = drafTermStartTime
    } else {
      phase = DisputesTypes.Phase.JuryDrafting
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

/**
 * Tells the adjudication state of a round at a certain time.
 * @param {Object} dispute Dispute querying the adjudication round of
 * @param {Object} round The round that is being queried
 * @param {Number} now Current time in ms
 * @param {Object} courtConfig The court configuration
 * @returns {Object} The adjudication phase of the requested round at the given time
 */
export function getAdjudicationPhase(dispute, round, now, courtConfig) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtConfig

  const { draftTermId, delayedTerms, number: roundId } = round

  const drafTermStartTime = getTermStartTime(draftTermId, courtConfig)
  const maxAppealReached = hasDisputeReachedMaxAppeals(dispute, courtConfig)

  // Case where we are at the last possible round and voting period has not started yet
  if (
    now < drafTermStartTime &&
    (DisputesTypes.Phase[round.state] === DisputesTypes.Phase.Invalid ||
      maxAppealReached)
  ) {
    return {
      phase: DisputesTypes.Phase.NotStarted,
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
      maxAppealReached,
      roundId,
    }
  }

  // If given term is before the appeal start term of the last round, then jurors are still allowed to reveal votes for the last round
  const appealTermStartTime = revealTermStartTime + revealTerms * termDuration
  if (now < appealTermStartTime) {
    return {
      phase: DisputesTypes.Phase.RevealVote,
      nextTransition: appealTermStartTime,
      maxAppealReached,
      roundId,
    }
  }

  // If the max number of appeals has been reached, then the last round is the final round and can be considered ended
  if (maxAppealReached) {
    return { phase: DisputesTypes.Phase.Ended, maxAppealReached, roundId }
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

/**
 * @dev Terminology here will be:
 *            Last round => dispute's last round
 *            Final round => max possible round for a dispute (when the max appeals for a given dispute is reached)
 * @param {Object} courtConfig The court configuration
 * @param {Object} round The round to get the phases from
 * @param {Object} currentPhase The dispute current phase
 * @returns {Array} Array of all `round` phases.
 */
function getRoundPhasesAndTime(courtConfig, round, currentPhase) {
  const {
    termDuration,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtConfig

  const { draftTermId, delayedTerms, number: roundId, vote, appeal } = round
  const isCurrentRound = roundId === currentPhase.roundId
  const { winningOutcome } = vote || {}

  const now = dayjs(new Date())

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

  const votingEndTime =
    disputeDraftStartTime + termDuration * (delayedTerms + commitTerms)
  const revealEndTime = votingEndTime + termDuration * revealTerms
  const appealEndTime = revealEndTime + termDuration * appealTerms
  const confirmAppealEndTime =
    appealEndTime + termDuration * appealConfirmationTerms

  const roundAppealed = !!appeal
  const roundAppealConfirmed = roundAppealed && appeal.opposedRuling > 0

  const roundPhasesAndTime = [
    {
      // Jurors can be drafted at any time
      phase: DisputesTypes.Phase.JuryDrafting,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.JuryDrafting === currentPhase.phase,
      roundId,
    },
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: votingEndTime,
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
      outcome: winningOutcome,
      showOutcome: now.isAfter(revealEndTime),
    },
    {
      // If the round was appealed we know it's a past phase and must update the endTime for the time this took effect (appeal.createdAt)
      // If it wasn't appealed we have two cases:
      //       - It's a past phase so in that case the endTime will be the time at where it's supposed to end if taking the full appealTerms duration
      //       - It's the dispute active phase (the round can still be appealed) so the endTime will be used to tell the timer remaining time before the appeal phase is closed
      phase: DisputesTypes.Phase.AppealRuling,
      endTime: roundAppealed ? appeal.createdAt : appealEndTime,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.AppealRuling === currentPhase.phase,
      roundId,
      outcome: roundAppealed ? appeal.appealedRuling : null,
      showOutcome: roundAppealed || now.isAfter(appealEndTime),
      // If the round was appealed, we'll show the outcome (appeal ruling),
      // If it wasn't appealed then we'll show a "Nobodoy appealed" message
    },
    {
      // If the round was appeal confirmed we know it's a past phase and must update the endTime for the time this took effect (appeal.confirmedAt)
      // If it wasn't appeal confirmed we have two cases:
      //       - It's a past phase so in that case the endTime will be the time at where it's supposed to end if taking the full confirmAppealTerms duration
      //       - It's the dispute active phase (the round can still be appeal confirmed) so the endTime will be used to tell the timer remaining time before the confirm appeal phase is closed
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime: roundAppealConfirmed ? appeal.confirmedAt : confirmAppealEndTime,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.ConfirmAppeal === currentPhase.phase,
      roundId,
      outcome: roundAppealConfirmed ? appeal.opposedRuling : null,
      showOutcome: roundAppealConfirmed || now.isAfter(confirmAppealEndTime),
    },
  ]

  // If it's not the last round means that it was appealed and confirm appealed
  // so we show all possible phases
  if (roundId < currentPhase.roundId) {
    return roundPhasesAndTime
  }

  // If it's the last round and has already ended (show past phases)
  if (
    currentPhase.phase === DisputesTypes.Phase.ExecuteRuling ||
    currentPhase.phase === DisputesTypes.Phase.ClaimRewards
  ) {
    // In the final round (maxAppealedReached), there's no drafting phase and appealing is not possible
    // so we only must show Voting and Revealing
    if (currentPhase.maxAppealReached) {
      return roundPhasesAndTime.slice(1, 3)
    }

    // If round not appealed
    if (!currentPhase.appealed) {
      return roundPhasesAndTime.slice(0, 4)
    }

    return roundPhasesAndTime
  }

  // Find the last round current phase
  const currentPhaseIndex = roundPhasesAndTime.findIndex(
    phase => phase.phase === currentPhase.phase
  )

  // When round has not yet ended
  return roundPhasesAndTime.slice(
    currentPhase.maxAppealReached ? 1 : 0,
    currentPhaseIndex + 1
  )
}

/**
 *
 * @param {Object} dispute The dispute in cuestion
 * @param {Object} courtConfig The court configuration
 * @returns {Number} The end time of the evidence submission phase in ms
 */
function getEvidenceSubmissionEndTime(dispute, courtConfig) {
  const firstRound = dispute.rounds[0]

  // If the evidence period is closed before the full `evidenceTerms` period,
  // the drafTermId for the first round is updated to the term this happened.
  return getTermStartTime(firstRound.draftTermId, courtConfig)
}

/**
 * Tells wether the dispute has reached the maximum number of rounds possible
 * @param {Object} dispute The dispute in cuestion
 * @param {Object} courtConfig The court configuration
 * @returns {Boolean} True if dispute has reached maximum number of rounds possible
 */
function hasDisputeReachedMaxAppeals(dispute, courtConfig) {
  const { maxRegularAppealRounds } = courtConfig
  const numberOfRounds = dispute.rounds.length
  return numberOfRounds > maxRegularAppealRounds
}

/**
 * @param {Object} dispute The dispute to get the last round from
 * @returns {Object} dispute's last round
 */
export function getDisputeLastRound(dispute) {
  return dispute.rounds[dispute.lastRoundId]
}

/**
 *
 * @param {Object} round Round to calculate fees from
 * @param {Object} courtConfig The court configuration
 * @returns {BigNum} The total `round` fees
 */
export function getRoundFees(round, courtConfig) {
  const {
    draftFee,
    settleFee,
    jurorFee,
    finalRoundReduction,
    maxRegularAppealRounds,
  } = courtConfig

  // Final round
  if (round.number === maxRegularAppealRounds) {
    return round.jurorsNumber
      .mul(jurorFee)
      .div(FINAL_ROUND_WEIGHT_PRECISION.mul(finalRoundReduction).div(PCT_BASE))
  }

  // Regular round
  return draftFee
    .add(settleFee)
    .add(jurorFee)
    .mul(round.jurorsNumber)
}

/**
 *
 * @param {BigNum} minActiveBalance The minimum active balance required to become an active juror
 * @param {BigNum} penaltyPct Permyriad of min active tokens balance to be locked to each drafted juror
 * @param {BigNum} weight Weight computed for a juror on a round
 * @returns {BigNum} The amount locked to a drafted juror
 */
export function getDraftLockAmount(minActiveBalance, penaltyPct, weight) {
  return minActiveBalance
    .mul(penaltyPct)
    .div(PCT_BASE)
    .mul(weight)
}
