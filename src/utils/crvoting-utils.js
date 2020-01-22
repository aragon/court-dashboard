import { bigNum } from '../lib/math-utils'
import { soliditySha3 } from '../lib/web3-utils'

const OUTCOMES = {
  MISSING: bigNum(0),
  LEAKED: bigNum(1),
  REFUSED: bigNum(2),
  AGAINST: bigNum(3),
  IN_FAVOUR: bigNum(4),
}

export const VOTE_OPTION_REFUSE = OUTCOMES.REFUSED.toString()
export const VOTE_OPTION_AGAINST = OUTCOMES.AGAINST.toString()
export const VOTE_OPTION_IN_FAVOUR = OUTCOMES.IN_FAVOUR.toString()

const SALT = `0x${soliditySha3('passw0rd')}` // TODO: Remove when implementation of the password is done

export const getVoteId = (disputeId, roundId) => {
  return bigNum(2)
    .pow(bigNum(128))
    .mul(bigNum(disputeId))
    .add(bigNum(roundId))
}

export const hashVote = (outcome, salt = SALT) => {
  return `0x${soliditySha3(outcome, salt)}`
}
