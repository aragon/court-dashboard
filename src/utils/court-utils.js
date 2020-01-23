import { bigNum } from '../lib/math-utils'

export const getVoteId = (disputeId, roundId) => {
  return bigNum(disputeId)
    .shln(128)
    .add(bigNum(roundId))
}
