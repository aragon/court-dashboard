import radspec from '../../radspec'
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
    approveFeeDeposit({ amount }) {
      return {
        icon: iconAnj,
        title: 'Approve fee deposit',
        description: radspec.approveFeeDeposit(amount),
      }
    },
    activateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Activate ANJ',
        description: radspec.activateAnj(amount),
      }
    },
    appealRuling({ disputeId, roundId, ruling }) {
      return {
        title: 'Appeal ruling',
        icon: iconAppealRuling,
        description: radspec.appealRuling(disputeId, roundId, ruling),
      }
    },
    buyActivateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Buy and activate ANJ',
        description: radspec.buyActivateAnj(amount),
      }
    },
    claimRewards({ amount }) {
      return {
        title: 'Claim rewards',
        icon: iconClaimRewards,
        description: radspec.claimRewards(amount),
      }
    },
    claimSubscriptionFees({ periodId }) {
      return {
        title: 'Claim Subscription rewards',
        icon: iconClaimRewards,
        description: radspec.claimSubscriptionFees(periodId),
      }
    },
    commitVote({ disputeId, roundId, outcome }) {
      return {
        title: 'Commit vote',
        icon: iconCommitVote,
        description: radspec.commitVote(disputeId, roundId, outcome),
      }
    },
    confirmAppeal({ disputeId, roundId, ruling }) {
      return {
        title: 'Confirm appeal',
        icon: iconAppealRuling,
        description: radspec.confirmAppeal(disputeId, roundId, ruling),
      }
    },
    deactivateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Deactivate ANJ',
        description: radspec.deactivateAnj(amount),
      }
    },
    draftJury({ disputeId }) {
      return {
        title: 'Draft jury',
        icon: iconDraftJury,
        description: radspec.draftJury(disputeId),
      }
    },
    executeRuling({ disputeId }) {
      return {
        title: 'Execute ruling',
        icon: iconExecuteRuling,
        description: radspec.executeRuling(disputeId),
      }
    },
    heartbeat({ transitions }) {
      return {
        title: 'Update term',
        icon: iconCourtLogo,
        description: radspec.heartbeat(transitions),
      }
    },
    leakVote({ voteId, voter }) {
      return {
        title: 'Leak vote',
        icon: iconCommitVote,
        description: radspec.leakVote(voteId, voter),
      }
    },
    revealVote({ roundId, disputeId }) {
      return {
        title: 'Reveal vote',
        icon: iconAnj,
        description: radspec.revealVote(roundId, disputeId),
      }
    },
    settleReward({ roundId, disputeId }) {
      return {
        icon: iconAnj,
        title: 'Settle reward',
        description: radspec.settleReward(roundId, disputeId),
      }
    },
    settleAppealDeposit({ roundId, disputeId }) {
      return {
        icon: iconAnj,
        title: 'Settle appeal deposit',
        description: radspec.settleAppealDeposit(roundId, disputeId),
      }
    },
    stakeActivateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Stake and activate ANJ',
        description: radspec.stakeActivateAnj(amount),
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
    withdrawAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Withdraw ANJ',
        description: radspec.withdrawAnj(amount),
      }
    },
  })
)

export function getActivityData(activityType, activityParams) {
  const activity =
    ACTIVITY_TYPES.get(activityType) || ACTIVITY_TYPES.get('transaction')
  return activity(activityParams || {})
}
