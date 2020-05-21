import {
  voteOptionToString,
  appealOptionToString,
} from './utils/crvoting-utils'
import { numberToWord } from './lib/math-utils'
import actions from './actions/court-action-types'

export default {
  [actions.ApproveFeeDeposit]: ({ amount }) => {
    return `Approve fee deposit: ${amount} ANJ`
  },
  [actions.ActivateAnj]: ({ amount }) => {
    return `Activate the total amount of ${amount} ANJ`
  },
  [actions.AppealRuling]: ({ disputeId, roundId, ruling }) => {
    return `Appeal round ${numberToWord(
      roundId
    )} of dispute #${disputeId} in favor of ruling: ${appealOptionToString(
      ruling
    )}`
  },
  [actions.ClaimRewards]: ({ amount }) => {
    return `Claim rewards for a total amount of ${amount} DAI`
  },
  [actions.ClaimSubscriptionFees]: ({ periodId }) => {
    return `Claim subscription rewards for period ${periodId}`
  },
  [actions.CommitVote]: ({ disputeId, roundId, outcome }) => {
    return `Vote ${voteOptionToString(outcome)} on round ${numberToWord(
      roundId
    )} of dispute #${disputeId}`
  },
  [actions.ConfirmAppeal]: ({ disputeId, roundId, ruling }) => {
    return `
        Confirm appeal round ${numberToWord(
          roundId
        )} of dispute #${disputeId} in favor of
        ruling: ${appealOptionToString(ruling)}
      `
  },
  [actions.DeactivateAnj]: ({ amount }) => {
    return `
        Deactivate the total amount of ${amount} ANJ
      `
  },
  [actions.DraftJury]: ({ disputeId }) => {
    return `
        Draft jurors for the next round of dispute #${disputeId}
      `
  },
  [actions.ExecuteRuling]: ({ disputeId }) => {
    return `
        Compute the final ruling for dispute #${disputeId}
      `
  },
  [actions.Heartbeat]: ({ transitions }) => {
    return `
        Transition ${transitions} court term${transitions > 1 ? 's' : ''}
      `
  },
  [actions.LeakVote]: ({ voteId, voter }) => {
    return `
        Leak vote of ${voter} for vote #${voteId}
      `
  },
  [actions.RevealVote]: ({ disputeId, roundId }) => {
    return `
        Reveal vote on round ${numberToWord(roundId)} for dispute #${disputeId}
      `
  },
  [actions.SettleReward]: ({ roundId, disputeId }) => {
    return `
        Settle reward for round ${numberToWord(
          roundId
        )} of dispute #${disputeId}
      `
  },
  [actions.SettleAppealDeposit]: ({ roundId, disputeId }) => {
    return `
        Settle appeal deposit for round ${numberToWord(
          roundId
        )} of dispute #${disputeId}
      `
  },
  [actions.WithdrawAnj]: ({ amount }) => {
    return `
        Withdraw the total amount of ${amount} ANJ
      `
  },
}
