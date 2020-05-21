import {
  voteOptionToString,
  appealOptionToString,
} from './utils/crvoting-utils'
import { numberToWord } from './lib/math-utils'

export default {
  approveFeeDeposit: amount => {
    return `Approve fee deposit: ${amount} DAI`
  },
  activateAnj: amount => {
    return `Activate the total amount of ${amount} ANJ`
  },
  appealRuling: (disputeId, roundId, ruling) => {
    return `Appeal round ${numberToWord(
      roundId
    )} of dispute #${disputeId} in favor of ruling: ${appealOptionToString(
      ruling
    )}`
  },
  buyActivateAnj: amount => {
    return `Activate the total amount of ${amount} ANJ`
  },
  claimRewards: amount => {
    return `Claim rewards for a total amount of ${amount} DAI`
  },
  claimSubscriptionFees: periodId => {
    return `Claim subscription rewards for period ${periodId}`
  },
  commitVote: (disputeId, roundId, outcome) => {
    return `Vote ${voteOptionToString(outcome)} on round ${numberToWord(
      roundId
    )} of dispute #${disputeId}`
  },
  confirmAppeal: (disputeId, roundId, ruling) => {
    return `
        Confirm appeal round ${numberToWord(
          roundId
        )} of dispute #${disputeId} in favor of
        ruling: ${appealOptionToString(ruling)}
      `
  },
  deactivateAnj: amount => {
    return `
        Deactivate the total amount of ${amount} ANJ
      `
  },
  draftJury: disputeId => {
    return `
        Draft jurors for the next round of dispute #${disputeId}
      `
  },
  executeRuling: disputeId => {
    return `
        Compute the final ruling for dispute #${disputeId}
      `
  },
  heartbeat: transitions => {
    return `
        Transition ${transitions} court term${transitions > 1 ? 's' : ''}
      `
  },
  leakVote: (voteId, voter) => {
    return `
        Leak vote of ${voter} for vote #${voteId}
      `
  },
  revealVote: (disputeId, roundId) => {
    return `
        Reveal vote on round ${numberToWord(roundId)} for dispute #${disputeId}
      `
  },
  settleReward: (roundId, disputeId) => {
    return `
        Settle reward for round ${numberToWord(
          roundId
        )} of dispute #${disputeId}
      `
  },
  settleAppealDeposit: (roundId, disputeId) => {
    return `
        Settle appeal deposit for round ${numberToWord(
          roundId
        )} of dispute #${disputeId}
      `
  },
  withdrawAnj: amount => {
    return `
        Withdraw the total amount of ${amount} ANJ
      `
  },
}
