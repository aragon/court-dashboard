import radspec from '../../radspec'
import actions from '../../actions/court-action-types'

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
    [actions.ApproveFeeDeposit]() {
      return {
        icon: iconAnj,
        title: 'Approve fee deposit',
      }
    },
    [actions.ActivateAnj]() {
      return {
        icon: iconAnj,
        title: 'Activate ANJ',
      }
    },
    [actions.AppealRuling]() {
      return {
        title: 'Appeal ruling',
        icon: iconAppealRuling,
      }
    },
    [actions.ClaimRewards]() {
      return {
        title: 'Claim rewards',
        icon: iconClaimRewards,
      }
    },
    [actions.ClaimSubscriptionFees]() {
      return {
        title: 'Claim Subscription rewards',
        icon: iconClaimRewards,
      }
    },
    [actions.CommitVote]() {
      return {
        title: 'Commit vote',
        icon: iconCommitVote,
      }
    },
    [actions.ConfirmAppeal]() {
      return {
        title: 'Confirm appeal',
        icon: iconAppealRuling,
      }
    },
    [actions.DeactivateAnj]() {
      return {
        icon: iconAnj,
        title: 'Deactivate ANJ',
      }
    },
    [actions.DraftJury]() {
      return {
        title: 'Draft jury',
        icon: iconDraftJury,
      }
    },
    [actions.ExecuteRuling]() {
      return {
        title: 'Execute ruling',
        icon: iconExecuteRuling,
      }
    },
    [actions.Heartbeat]() {
      return {
        title: 'Update term',
        icon: iconCourtLogo,
      }
    },
    [actions.LeakVote]() {
      return {
        title: 'Leak vote',
        icon: iconCommitVote,
      }
    },
    [actions.RevealVote]() {
      return {
        title: 'Reveal vote',
        icon: iconAnj,
      }
    },
    [actions.SettleReward]() {
      return {
        icon: iconAnj,
        title: 'Settle reward',
      }
    },
    [actions.SettleAppealDeposit]() {
      return {
        icon: iconAnj,
        title: 'Settle appeal deposit',
      }
    },
    transaction() {
      return {
        title: 'Transaction',
        icon: iconAnj,
      }
    },
    [actions.WithdrawAnj]() {
      return {
        icon: iconAnj,
        title: 'Withdraw ANJ',
      }
    },
  })
)

export function getActivityData({
  activityDescription,
  activityParams,
  activityType,
}) {
  console.log(
    'activityDescription,activityParams,activityType,',
    activityDescription,
    activityParams,
    activityType
  )

  const activity =
    ACTIVITY_TYPES.get(activityType) || ACTIVITY_TYPES.get('transaction')

  const { title, icon } = activity()

  // Older activities don't have the description stored but use the old `activityParams`
  // so we should fallback to describe the actvity if the description is not present
  const description =
    activityDescription || radspec[activityType](activityParams)

  return { description, icon, title }
}
