import { voteOptionToString } from '../../utils/crvoting-utils'
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
        description: `
          Approve fee deposit: ${amount} ANJ
        `,
      }
    },
    activateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Activate ANJ',
        description: `
          Activate the total amount of ${amount} ANJ
        `,
      }
    },
    appealRuling({ disputeId, roundId, ruling }) {
      return {
        title: 'Appeal ruling',
        icon: iconAppealRuling,
        description: `
          Appeal round #${roundId} of dispute #${disputeId} in favor of ruling
          ${ruling}
        `,
      }
    },
    buyActivateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Buy and activate ANJ',
        description: `
          Activate the total amount of ${amount} ANJ
        `,
      }
    },
    claimRewards({ disputeId, roundId, jurorAddress }) {
      return {
        title: 'Claim rewards',
        icon: iconClaimRewards,
        description: `
          Claim reward for round #${roundId} of dispute #${disputeId} for juror
          ${jurorAddress}
        `,
      }
    },
    claimSubscriptionFees({ periodId }) {
      return {
        title: 'Claim Subscription rewards',
        icon: iconClaimRewards,
        description: `
          Claim subscription rewards for period ${periodId}
        `,
      }
    },
    commitVote({ disputeId, roundId, outcome }) {
      return {
        title: 'Commit vote',
        icon: iconCommitVote,
        description: `
          Vote ${voteOptionToString(
            outcome
          )} on round #${roundId} of dispute #${disputeId}
        `,
      }
    },
    confirmAppeal({ disputeId, roundId, ruling }) {
      return {
        title: 'Confirm appeal',
        icon: iconAppealRuling,
        description: `
          Confirm appeal round #${roundId} of dispute #${disputeId} in favor of
          ruling ${ruling}
        `,
      }
    },
    deactivateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Deactivate ANJ',
        description: `
          Deactivate the total amount of ${amount} ANJ
        `,
      }
    },
    draftJury({ disputeId }) {
      return {
        title: 'Draft jury',
        icon: iconDraftJury,
        description: `
          Draft jurors for the next round of dispute #${disputeId}
        `,
      }
    },
    executeRuling({ disputeId }) {
      return {
        title: 'Execute ruling',
        icon: iconExecuteRuling,
        description: `
          Compute the final ruling for dispute #${disputeId}
        `,
      }
    },
    heartbeat({ transitions }) {
      return {
        title: 'Update term',
        icon: iconCourtLogo,
        description: `
          Transition ${transitions} court term${transitions > 1 ? 's' : ''}
        `,
      }
    },
    leakVote({ voteId, voter }) {
      return {
        title: 'Leak vote',
        icon: iconCommitVote,
        description: `
          Leak vote of ${voter} for vote #${voteId}
        `,
      }
    },
    revealVote({ roundId, disputeId }) {
      return {
        title: 'Reveal vote',
        icon: iconAnj,
        description: `
          Reveal vote on round ${roundId} for dispute #${disputeId}
        `,
      }
    },
    settleReward({ roundId, disputeId }) {
      return {
        icon: iconAnj,
        title: 'Settle reward',
        description: `
          Settle reward for round #${roundId} of dispute #${disputeId}
        `,
      }
    },
    settleAppealDeposit({ roundId, disputeId }) {
      return {
        icon: iconAnj,
        title: 'Settle appeal deposit',
        description: `
          Settle appeal deposit for round #${roundId} of dispute #${disputeId}
        `,
      }
    },
    stakeActivateAnj({ amount }) {
      return {
        icon: iconAnj,
        title: 'Stake and activate ANJ',
        description: `
          Activate the total amount of ${amount} ANJ
        `,
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
        description: `
          Withdraw the total amount of ${amount} ANJ
        `,
      }
    },
  })
)

export function getActivityData(activityType, activityParams) {
  const activity =
    ACTIVITY_TYPES.get(activityType) || ACTIVITY_TYPES.get('transaction')
  return activity(activityParams || {})
}
