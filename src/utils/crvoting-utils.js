import { bigNum } from '../lib/math-utils'
import { soliditySha3, hash256 } from '../lib/web3-utils'

const OUTCOMES = {
  MISSING: 0,
  LEAKED: 1,
  REFUSED: 2,
  AGAINST: 3,
  IN_FAVOUR: 4,
}

export const VOTE_OPTION_REFUSE = OUTCOMES.REFUSED.toString()
export const VOTE_OPTION_AGAINST = OUTCOMES.AGAINST.toString()
export const VOTE_OPTION_IN_FAVOUR = OUTCOMES.IN_FAVOUR.toString()

const VOTE_OPTIONS = [
  VOTE_OPTION_REFUSE,
  VOTE_OPTION_AGAINST,
  VOTE_OPTION_IN_FAVOUR,
]

const optionStringMapping = {
  [VOTE_OPTION_REFUSE]: 'REFUSED TO VOTE',
  [VOTE_OPTION_AGAINST]: 'VOTED AGAINST',
  [VOTE_OPTION_IN_FAVOUR]: 'VOTED IN FAVOUR',
}

export function voteToString(outcome) {
  return optionStringMapping[outcome]
}

export const DEFAULT_SALT = hash256('passw0rd') // TODO: Remove when implementation of the password is done

export function getVoteId(disputeId, roundId) {
  return bigNum(2)
    .pow(bigNum(128))
    .mul(bigNum(disputeId))
    .add(bigNum(roundId))
}

export function getOutcomeFromCommitment(commitment, salt = DEFAULT_SALT) {
  return VOTE_OPTIONS.find(option => hashVote(option, salt) === commitment)
}

export function hashVote(outcome, salt = DEFAULT_SALT) {
  return soliditySha3(['uint8', 'bytes32'], [outcome, salt])
}

export function isVoteValid(commitment) {
  if (!commitment) return false

  return (
    commitment.gte(VOTE_OPTION_REFUSE) && commitment.lte(VOTE_OPTION_IN_FAVOUR)
  )
}

export function isvoteLeaked(outcome) {
  if (!outcome) return false

  return outcome === OUTCOMES.LEAKED
}
