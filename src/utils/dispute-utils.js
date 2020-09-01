import { toMs } from './date-utils'
import { bigNum } from '../lib/math-utils'
import { getOutcomeNumber } from './crvoting-utils'
import * as DisputesTypes from '../types/dispute-status-types'
import { getTermEndTime, getTermStartTime } from './court-utils'
import { getVoidedDisputesByCourt } from '../flagged-disputes/voided-disputes'
import { getPrecedenceCampaignDisputesByCourt } from '../flagged-disputes/precedence-campaign-disputes'

export const FINAL_ROUND_WEIGHT_PRECISION = bigNum(1000)
export const PCT_BASE = bigNum(10000)

export function transformRoundDataAttributes(round) {
  const { vote, appeal } = round

  return {
    ...round,
    createdAt: toMs(parseInt(round.createdAt, 10)),
    draftTermId: parseInt(round.draftTermId, 10),
    delayedTerms: parseInt(round.delayedTerms, 10),
    number: parseInt(round.number),
    jurors: round.jurors.map(juror => ({
      ...juror,
      commitmentDate: toMs(parseInt(juror.commitmentDate || 0, 10)),
      revealDate: toMs(parseInt(juror.revealDate || 0, 10)),
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
          createdAt: toMs(parseInt(appeal.createdAt)),
          confirmedAt: toMs(parseInt(appeal.confirmedAt || 0)),
        }
      : null,
    state: DisputesTypes.convertFromString(round.state),
  }
}

/**
 * Parses metadata of the given dispute

 * Disputes metadata comes in two forms:
 *        1 - Raw disputes: metadata is usually a JSON object containing `description` and `metadata` where the later is the metadata uri.
 *        2 - Disputables: there's no useful information in `metadata` itself, in this case we'll get the dispute information from the `disputable` attr.
 *  Note that this function is meant to parse only dispute description and metadata uri (in case it exists). More relevant information will be processed elsewhere.
 * @param {Object} dispute Dispute in question
 * @returns {Array<String>} Array where the first item is the dispute description and second item is the metadata uri if it exists
 */
function parseMetadata(dispute) {
  if (dispute.disputable) {
    return [dispute.disputable.title]
  }

  try {
    const { description, metadata } = JSON.parse(dispute.metadata)
    return [description, metadata]
  } catch (error) {
    // if is not a json return the metadata as the description
    return [dispute.metadata]
  }
}

export function transformDisputeDataAttributes(dispute) {
  const [description, metadataUri] = parseMetadata(dispute)

  const transformedDispute = {
    ...dispute,
    createdAt: toMs(parseInt(dispute.createdAt, 10)),
    description,
    metadataUri,
    rounds: dispute.rounds.map(transformRoundDataAttributes),
    state: DisputesTypes.convertFromString(dispute.state),
    status:
      DisputesTypes.convertFromString(dispute.state) ===
      DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
  }

  // If the dispute is part of the precedence campaign we will flag it as such
  const precedenceCamapignDisputes = getPrecedenceCampaignDisputesByCourt()
  const isPartOfPrecedenceCampaign = precedenceCamapignDisputes.has(dispute.id)
  transformedDispute.marksPrecedent = isPartOfPrecedenceCampaign

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
 * @param {Number} currentTerm The court current term
 * @returns {Array} The timeline of the given dispute
 */
export function getDisputeTimeLine(dispute, courtConfig, currentTerm) {
  const { createdAt } = dispute

  const currentPhaseAndTime = getPhaseAndTransition(
    dispute,
    currentTerm,
    courtConfig
  )

  const evidenceSubmissionEndTerm = getEvidenceSubmissionEndTerm(
    dispute,
    courtConfig
  )
  const evidenceSubmissionEndTime = getTermEndTime(
    evidenceSubmissionEndTerm,
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
      round,
      currentPhaseAndTime,
      currentTerm,
      courtConfig
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
 * @param {Number} currentTerm The court current term
 * @param {Object} courtConfig The court configuration
 * @returns {Object} Current phase and next phase transition for the given dispute
 */
export function getPhaseAndTransition(dispute, currentTerm, courtConfig) {
  if (!dispute) return null

  let phase
  let nextTransition

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
    const evidenceSubmissionEndTerm = getEvidenceSubmissionEndTerm(
      dispute,
      courtConfig
    )
    const evidenceSubmissionEndTime = getTermEndTime(
      evidenceSubmissionEndTerm,
      courtConfig
    )

    if (currentTerm > evidenceSubmissionEndTerm) {
      phase = DisputesTypes.Phase.JuryDrafting
    } else {
      phase = state
      nextTransition = evidenceSubmissionEndTime
    }
    return { phase, nextTransition, roundId: number }
  }

  // Jury Drafting phase
  if (state === DisputesTypes.Phase.JuryDrafting) {
    // When a new round is created, it could happen that the draft term has not been reached yet
    // because the confirm appeal phase of the previous round has not yet ended
    if (currentTerm < lastRound.draftTermId) {
      const draftStartTime = getTermStartTime(
        lastRound.draftTermId,
        courtConfig
      )

      phase = DisputesTypes.Phase.NotStarted
      nextTransition = draftStartTime
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
      currentTerm,
      courtConfig
    )

    const { phase, phaseEndTerm } = currentAdjudicationPhase
    if (phase === DisputesTypes.Phase.Ended) {
      currentAdjudicationPhase = {
        ...currentAdjudicationPhase,
        phase: DisputesTypes.Phase.ExecuteRuling,
      }
    }

    const nextTransition = phaseEndTerm
      ? getTermEndTime(phaseEndTerm, courtConfig)
      : null

    return { ...currentAdjudicationPhase, roundId: number, nextTransition }
  }
}

/**
 * Tells the adjudication state of a dispute's round at a certain time.
 * @param {Object} dispute Dispute to query the adjudication round of
 * @param {Object} round The round that is being queried
 * @param {Number} termId The term at which to query the dispute's adjudication phase
 * @param {Object} courtConfig The court configuration
 * @returns {Object} The adjudication phase of the requested round at the given time
 */
export function getAdjudicationPhase(dispute, round, termId, courtConfig) {
  const {
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtConfig

  const { draftTermId, delayedTerms, number: roundId } = round

  const draftEndTerm = draftTermId + delayedTerms
  const maxAppealReached = hasDisputeReachedMaxAppeals(dispute, courtConfig)

  // When voting period has not yet started there are two possible cases:
  //   * We are at the last possible round so adjudication phase hasn't started
  //   * We are not in an adjudication phase so it is invalid
  if (termId < draftEndTerm) {
    if (maxAppealReached) {
      return {
        phase: DisputesTypes.Phase.NotStarted,
        phaseEndTerm: draftEndTerm,
        roundId,
      }
    }

    return {
      phase: DisputesTypes.Phase.Invalid,
      roundId,
    }
  }

  // Jurors can commit their votes between when the commit phase term starts and ends
  // Note that the commit start term is the same as the draft end term
  const commitEndTerm = draftEndTerm + commitTerms - 1
  if (termId <= commitEndTerm) {
    return {
      phase: DisputesTypes.Phase.VotingPeriod,
      phaseEndTerm: commitEndTerm,
      maxAppealReached,
      roundId,
    }
  }

  // Jurors can reveal their votes between when the reveal phase term starts and ends
  const revealEndTerm = commitEndTerm + revealTerms
  if (termId <= revealEndTerm) {
    return {
      phase: DisputesTypes.Phase.RevealVote,
      phaseEndTerm: revealEndTerm,
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
  const appealEndTerm = revealEndTerm + appealTerms

  if (!isLastRoundAppealed) {
    // If given term is before the appeal confirmation start term, then the last round can still be appealed. Otherwise, it is ended.
    if (termId <= appealEndTerm) {
      return {
        phase: DisputesTypes.Phase.AppealRuling,
        phaseEndTerm: appealEndTerm,
        roundId,
      }
    } else {
      return {
        phase: DisputesTypes.Phase.Ended,
        roundId,
      }
    }
  }

  // If the last round was appealed and the given term is before the appeal confirmation end term, then the last round appeal can still be
  // confirmed. Note that if the round being checked was already appealed and confirmed, it won't be the last round, thus it will be caught
  // above by the first check and considered 'Ended'.
  const appealConfirmationEndTerm = appealEndTerm + appealConfirmationTerms

  if (termId < appealConfirmationEndTerm) {
    return {
      phase: DisputesTypes.Phase.ConfirmAppeal,
      phaseEndTerm: appealConfirmationEndTerm,
      roundId,
    }
  }

  // If non of the above conditions have been met, the last round is considered ended
  return {
    phase: DisputesTypes.Phase.Ended,
    roundId,
  }
}

/**
 * Terminology here will be:
 *        Last round => last round actually reached in a dispute
 *        Final round => max possible round for a dispute (when the max appeals for a given dispute is reached)
 * @param {Object} round The round to get the phases from
 * @param {Object} currentPhase The dispute's current phase
 * @param {Number} currentTerm The court current term
 * @param {Object} courtConfig The court configuration
 * @returns {Array} Array of all `round` phases.
 */
function getRoundPhasesAndTime(round, currentPhase, currentTerm, courtConfig) {
  const {
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = courtConfig

  const { draftTermId, delayedTerms, number: roundId, vote, appeal } = round
  const isCurrentRound = roundId === currentPhase.roundId
  const { winningOutcome } = vote || {}

  const draftStartTime = getTermStartTime(draftTermId, courtConfig)

  // Case where we are in a next round and has not yet started
  if (isCurrentRound && currentPhase.phase === DisputesTypes.Phase.NotStarted) {
    return [
      {
        phase: DisputesTypes.Phase.NotStarted,
        endTime: draftStartTime,
        roundId,
        active: true,
      },
    ]
  }

  const draftEndTerm = draftTermId + delayedTerms
  // Note that the commit start term is the same as the draft end term
  const votingEndTerm = draftEndTerm + commitTerms - 1
  const revealEndTerm = votingEndTerm + revealTerms
  const appealEndTerm = revealEndTerm + appealTerms
  const confirmAppealEndTerm = appealEndTerm + appealConfirmationTerms

  const roundAppealed = !!appeal
  const roundAppealConfirmed = roundAppealed && appeal.opposedRuling > 0

  const roundPhasesAndTime = [
    {
      // Jurors can be drafted at any time, so we'll only set the
      // `endTime` when the drafting phase has already passed
      phase: DisputesTypes.Phase.JuryDrafting,
      endTime:
        DisputesTypes.Phase.JuryDrafting !== currentPhase.phase
          ? getTermEndTime(draftEndTerm, courtConfig)
          : null,
      active:
        isCurrentRound &&
        DisputesTypes.Phase.JuryDrafting === currentPhase.phase,
      roundId,
    },
    {
      phase: DisputesTypes.Phase.VotingPeriod,
      endTime: getTermEndTime(votingEndTerm, courtConfig),
      active:
        isCurrentRound &&
        DisputesTypes.Phase.VotingPeriod === currentPhase.phase,
      roundId,
    },
    {
      phase: DisputesTypes.Phase.RevealVote,
      endTime: getTermEndTime(revealEndTerm, courtConfig),
      active:
        isCurrentRound && DisputesTypes.Phase.RevealVote === currentPhase.phase,
      roundId,
      outcome: winningOutcome,
      showOutcome: currentTerm > revealEndTerm,
    },
    {
      // If the round was appealed we know it's a past phase and must update the endTime for the time this took effect (appeal.createdAt)
      // If it wasn't appealed we have two cases:
      //       - It's a past phase so in that case the endTime will be the time at where it's supposed to end if taking the full appealTerms duration
      //       - It's the dispute active phase (the round can still be appealed) so the endTime will be used to tell the timer remaining time before the appeal phase is closed
      phase: DisputesTypes.Phase.AppealRuling,
      endTime: roundAppealed
        ? appeal.createdAt
        : getTermEndTime(appealEndTerm, courtConfig),
      active:
        isCurrentRound &&
        DisputesTypes.Phase.AppealRuling === currentPhase.phase,
      roundId,
      outcome: roundAppealed ? appeal.appealedRuling : null,
      showOutcome: roundAppealed || currentTerm > appealEndTerm,
      // If the round was appealed, we'll show the outcome (appeal ruling),
      // If it wasn't appealed then we'll show a "Nobodoy appealed" message
    },
    {
      // If the round was appeal confirmed we know it's a past phase and must update the endTime for the time this took effect (appeal.confirmedAt)
      // If it wasn't appeal confirmed we have two cases:
      //       - It's a past phase so in that case the endTime will be the time at where it's supposed to end if taking the full confirmAppealTerms duration
      //       - It's the dispute active phase (the round can still be appeal confirmed) so the endTime will be used to tell the timer remaining time before the confirm appeal phase is closed
      phase: DisputesTypes.Phase.ConfirmAppeal,
      endTime: roundAppealConfirmed
        ? appeal.confirmedAt
        : getTermEndTime(confirmAppealEndTerm, courtConfig),
      active:
        isCurrentRound &&
        DisputesTypes.Phase.ConfirmAppeal === currentPhase.phase,
      roundId,
      outcome: roundAppealConfirmed ? appeal.opposedRuling : null,
      showOutcome: roundAppealConfirmed || currentTerm > confirmAppealEndTerm,
    },
  ]

  // If it's not the last round means that the dispute reached the next appeal round
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
    if (!roundAppealed) {
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
 * @param {Object} dispute The dispute in question
 * @param {Object} courtConfig The court configuration
 * @returns {Number} The end time of the evidence submission phase in ms
 */
function getEvidenceSubmissionEndTerm(dispute, courtConfig) {
  const firstRound = dispute.rounds[0]

  // If the evidence period is closed before the full `evidenceTerms` period,
  // the draftTermId for the first round is updated to the term this happened.
  return firstRound.draftTermId - 1
}

/**
 * Tells whether the dispute has reached the maximum number of rounds possible
 * @param {Object} dispute The dispute in question
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
 * @returns {BigNum} The total fees for the round
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
    return jurorFee
      .mul(round.jurorsNumber)
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
 * @param {BigNum} penaltyPct Percentage (against PCT_BASE) of min active tokens balance to be locked to each drafted juror
 * @param {BigNum} weight Weight computed for a juror on a round
 * @returns {BigNum} The amount that will be locked each time a juror is drafted
 */
export function getDraftLockAmount(minActiveBalance, penaltyPct, weight) {
  return minActiveBalance
    .mul(penaltyPct)
    .div(PCT_BASE)
    .mul(weight)
}
