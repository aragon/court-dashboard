import { IconClose, IconCheck } from '@aragon/ui'

import { soliditySha3, hash256 } from '../lib/web3-utils'
import { bigNum } from '../lib/math-utils'

export const OUTCOMES = {
  Missing: 0,
  Leaked: 1,
  Refused: 2,
  Against: 3,
  InFavor: 4,
}

export const VOTE_OPTION_REFUSE = OUTCOMES.Refused
export const VOTE_OPTION_AGAINST = OUTCOMES.Against
export const VOTE_OPTION_IN_FAVOR = OUTCOMES.InFavor
export const NOBODY_APPEALED = 'Nobody appealed'
export const NOBODY_CONFIRMED = 'No confirmation'

const optionStringMapping = {
  [VOTE_OPTION_REFUSE]: 'REFUSE TO VOTE',
  [VOTE_OPTION_AGAINST]: 'AGAINST',
  [VOTE_OPTION_IN_FAVOR]: 'IN FAVOR',
}

export function voteToString(outcome) {
  return optionStringMapping[outcome]
}

const outcomeStringMapping = {
  [OUTCOMES.Missing]: 'Refused to vote',
  [OUTCOMES.Leaked]: 'Invalid ruling',
  [OUTCOMES.Refused]: 'Refused to vote',
  [OUTCOMES.Against]: 'Voted against',
  [OUTCOMES.InFavor]: 'Voted in favor',
}

const appealRulingStringMapping = {
  [OUTCOMES.Leaked]: 'Invalid ruling',
  [OUTCOMES.Refused]: 'Refused',
  [OUTCOMES.Against]: 'Ruled Against',
  [OUTCOMES.InFavor]: 'Ruled in favor',
}

export function juryOutcomeToString(outcome) {
  if (!outcome) {
    return outcomeStringMapping[OUTCOMES.Refused]
  }
  return outcomeStringMapping[outcome]
}

export function appealRulingToString(outcome, confirm) {
  if (!outcome) {
    return confirm ? NOBODY_CONFIRMED : NOBODY_APPEALED
  }
  return appealRulingStringMapping[outcome]
}

const VALID_OUTCOMES = [OUTCOMES.Refused, OUTCOMES.Against, OUTCOMES.InFavor]

/**
 *
 * @param {String} outcome String representation of the outcome
 * @returns {Number} corresponding outcome number
 */
export function getOutcomeNumber(outcome) {
  return OUTCOMES[outcome]
}

/**
 *
 * @param {bytes} commitment vote commitment
 * @param {bytes} salt password used to get the commitment
 * @returns {Number} outcome
 */
export function getOutcomeFromCommitment(commitment, salt) {
  return VALID_OUTCOMES.find(option => hashVote(option, salt) === commitment)
}

/**
 * returns all possible appeal ruling options
 * @param {Number} currentOutcome current round outcome
 * @returns {Array} Array of appeal ruling options
 */
export function getAppealRulingOptions(currentOutcome) {
  return VALID_OUTCOMES.filter(
    outcome => outcome !== currentOutcome
  ).map(outcome => ({ outcome, description: voteToString(outcome) }))
}

export function filterByValidOutcome(totalValidOutcomes) {
  return VALID_OUTCOMES.map(outcomeFilter => {
    return {
      outcomes: totalValidOutcomes.filter(
        ({ outcome }) => outcome === outcomeFilter
      ),
      outcome: outcomeFilter,
    }
  })
}

export function getVoteId(disputeId, roundId) {
  return bigNum(2)
    .pow(bigNum(128))
    .mul(bigNum(disputeId))
    .add(bigNum(roundId))
}

export function hashPassword(salt) {
  return hash256(salt)
}

export function hashVote(outcome, salt) {
  return soliditySha3(['uint8', 'bytes32'], [outcome, hash256(salt)])
}

/**
 *
 * @param {Number} outcome vote outcome
 * @returns {Boolean} True if outcome is valid
 */
export function isValidOutcome(outcome) {
  return (
    VALID_OUTCOMES[0] <= outcome &&
    outcome <= VALID_OUTCOMES[VALID_OUTCOMES.length - 1]
  )
}

export function isvoteLeaked(outcome) {
  if (!outcome) return false

  return outcome === OUTCOMES.Leaked
}

export function getTotalOutcomeWeight(outcomes) {
  return outcomes.reduce((acc, { weight }) => acc + weight, 0)
}

export function getOutcomeColor(outcome, theme) {
  if (outcome === OUTCOMES.InFavor) return theme.positive
  if (outcome === OUTCOMES.Against) return theme.negative

  return theme.hint
}

export function getOutcomeIcon(outcome, theme) {
  if (!outcome || outcome === OUTCOMES.Refused) {
    return {
      Icon: IconClose,
      color: '#8fa4b5',
    }
  }

  if (outcome === OUTCOMES.Against) {
    return {
      Icon: IconClose,
      color: theme.negative,
    }
  }

  if (outcome === OUTCOMES.InFavor) {
    return {
      Icon: IconCheck,
      color: theme.positive,
    }
  }
}
