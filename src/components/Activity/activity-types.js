import radspec from '../../radspec'
import actions from '../../types/court-action-types'

import iconAnj from './assets/activity-icon-anj.svg'
import iconAppealRuling from './assets/activity-icon-appeal-ruling.svg'
import iconClaimRewards from './assets/activity-icon-claim-rewards.svg'
import iconCommitVote from './assets/activity-icon-commit-vote.svg'
import iconCourtLogo from './assets/activity-icon-court-logo.svg'
import iconDraftJury from './assets/activity-icon-draft-jury.svg'
import iconExecuteRuling from './assets/activity-icon-execute-ruling.svg'

// The different types of activity
const ACTIVITY_TYPES = new Map(
  Object.entries({
    [actions.ApproveFeeDeposit]({ amount }) {
      return {
        icon: iconAnj,
        title: 'Approve fee deposit',
        description: radspec[actions.ApproveFeeDeposit](amount),
      }
    },
    [actions.ActivateAnj]({ amount }) {
      return {
        icon: iconAnj,
        title: 'Activate ANJ',
        description: radspec[actions.ActivateAnj](amount),
      }
    },
    [actions.AppealRuling]({ disputeId, roundId, ruling }) {
      return {
        title: 'Appeal ruling',
        icon: iconAppealRuling,
        description: radspec[actions.AppealRuling](disputeId, roundId, ruling),
      }
    },
    [actions.ClaimRewards]({ amount }) {
      return {
        title: 'Claim rewards',
        icon: iconClaimRewards,
        description: radspec[actions.ClaimRewards](amount),
      }
    },
    [actions.ClaimSubscriptionFees]({ periodId }) {
      return {
        title: 'Claim Subscription rewards',
        icon: iconClaimRewards,
        description: radspec[actions.ClaimSubscriptionFees](periodId),
      }
    },
    [actions.CommitVote]({ disputeId, roundId, outcome }) {
      return {
        title: 'Commit vote',
        icon: iconCommitVote,
        description: radspec[actions.CommitVote](disputeId, roundId, outcome),
      }
    },
    [actions.ConfirmAppeal]({ disputeId, roundId, ruling }) {
      return {
        title: 'Confirm appeal',
        icon: iconAppealRuling,
        description: radspec[actions.ConfirmAppeal](disputeId, roundId, ruling),
      }
    },
    [actions.DeactivateAnj]({ amount }) {
      return {
        icon: iconAnj,
        title: 'Deactivate ANJ',
        description: radspec[actions.DeactivateAnj](amount),
      }
    },
    [actions.DraftJury]({ disputeId }) {
      return {
        title: 'Draft jury',
        icon: iconDraftJury,
        description: radspec[actions.DraftJury](disputeId),
      }
    },
    [actions.ExecuteRuling]({ disputeId }) {
      return {
        title: 'Execute ruling',
        icon: iconExecuteRuling,
        description: radspec[actions.ExecuteRuling](disputeId),
      }
    },
    [actions.Heartbeat]({ transitions }) {
      return {
        title: 'Update term',
        icon: iconCourtLogo,
        description: radspec[actions.Heartbeat](transitions),
      }
    },
    [actions.LeakVote]({ voteId, voter }) {
      return {
        title: 'Leak vote',
        icon: iconCommitVote,
        description: radspec[actions.LeakVote](voteId, voter),
      }
    },
    [actions.RevealVote]({ roundId, disputeId }) {
      return {
        title: 'Reveal vote',
        icon: iconAnj,
        description: radspec[actions.RevealVote](roundId, disputeId),
      }
    },
    [actions.SettleReward]({ roundId, disputeId }) {
      return {
        icon: iconAnj,
        title: 'Settle reward',
        description: radspec[actions.SettleReward](roundId, disputeId),
      }
    },
    [actions.SettleAppealDeposit]({ roundId, disputeId }) {
      return {
        icon: iconAnj,
        title: 'Settle appeal deposit',
        description: radspec[actions.SettleAppealDeposit](roundId, disputeId),
      }
    },
    transaction({ transactionHash }) {
      return {
        title: 'Transaction',
        icon: iconAnj,
        description: `
          Transaction: ${transactionHash}
        `,
      }
    },
    [actions.WithdrawAnj]({ amount }) {
      return {
        icon: iconAnj,
        title: 'Withdraw ANJ',
        description: radspec[actions.WithdrawAnj](amount),
      }
    },
  })
)

export function getActivityData(activityType, activityParams) {
  const activity =
    ACTIVITY_TYPES.get(activityType) || ACTIVITY_TYPES.get('transaction')
  return activity(activityParams || {})
}
