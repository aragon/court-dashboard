import { bigNum } from '../lib/math-utils'

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

export const getVoteId = (disputeId, roundId) => {
  return bigNum(2)
    .pow(bigNum(128))
    .mul(bigNum(disputeId))
    .add(bigNum(roundId))
}

export const hashVote = (outcome, salt) => {
  // return `0x${soliditySha3(outcome, salt)}`
}
