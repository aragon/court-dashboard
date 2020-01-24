import { soliditySha3, hash256 } from '../lib/web3-utils'
import { bigNum } from '../lib/math-utils'

export const DEFAULT_SALT = hash256('passw0rd') // TODO: Remove when implementation of the password is done

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

export function outcomeToString(outcome) {
  return outcomeStringMapping[outcome]
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
export function getOutcomeFromCommitment(commitment, salt = DEFAULT_SALT) {
  return VALID_OUTCOMES.find(option => hashVote(option, salt) === commitment)
}

/**
 * returns all possible appeal ruling options
 * @param {String} winningOutcome the resulting winning outcome of a vote
 * @returns {Array} Array of appeal ruling options
 */
export function getAppealRulingOptions(winningOutcome) {
  const winningOutcomeNumber = getOutcomeNumber(winningOutcome)

  return VALID_OUTCOMES.filter(outcome => {
    return outcome !== winningOutcomeNumber
  }).map(outcome => ({ outcome, description: voteToString(outcome) }))
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

export function hashVote(outcome, salt = DEFAULT_SALT) {
  return soliditySha3(['uint8', 'bytes32'], [outcome, salt])
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
