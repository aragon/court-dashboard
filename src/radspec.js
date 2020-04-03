import {
  voteOptionToString,
  appealOptionToString,
} from './utils/crvoting-utils'

export default {
  approveFeeDeposit: amount => {
    return `Approve fee deposit: ${amount} ANJ`
  },
  activateAnj: amount => {
    return `Activate the total amount of ${amount} ANJ`
  },
  appealRuling: (disputeId, roundId, ruling) => {
    return `Appeal round #${roundId} of dispute #${disputeId} in favor of ruling ${appealOptionToString(
      ruling
    )}`
  },
  buyActivateAnj: amount => {
    return `Activate the total amount of ${amount} ANJ`
  },
  claimRewards: (disputeId, roundId, jurorAddress) => {
    return `Claim reward for round #${roundId} of dispute #${disputeId} for juror ${jurorAddress}`
  },
  claimSubscriptionFees: periodId => {
    return `Claim subscription rewards for period ${periodId}`
  },
  commitVote: (disputeId, roundId, outcome) => {
    return `Vote ${voteOptionToString(
      outcome
    )} on round #${roundId} of dispute #${disputeId}`
  },
  confirmAppeal: (disputeId, roundId, ruling) => {
    return `
        Confirm appeal round #${roundId} of dispute #${disputeId} in favor of
        ruling ${appealOptionToString(ruling)}
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
  revealVote: (roundId, disputeId) => {
    return `
        Reveal vote on round ${roundId} for dispute #${disputeId}
      `
  },
  settleReward: (roundId, disputeId) => {
    return `
        Settle reward for round #${roundId} of dispute #${disputeId}
      `
  },
  settleAppealDeposit: (roundId, disputeId) => {
    return `
        Settle appeal deposit for round #${roundId} of dispute #${disputeId}
      `
  },
  stakeActivateAnj: amount => {
    return `
        Activate the total amount of ${amount} ANJ
      `
  },
  transaction: transactionHash => {
    return `
        Transaction: ${transactionHash}
      `
  },
  withdrawAnj: amount => {
    return `
        Withdraw the total amount of ${amount} ANJ
      `
  },
}
