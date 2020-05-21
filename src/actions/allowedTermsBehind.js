import actions from './court-action-types'

const TERM_AGNOSTIC = -1

// Some court actions cannot be executed if the court clock term is not synced or is more than a certain number of terms behind.
// This is a mapping of every action and it's the number of maximum allowed terms behind to be able to be executed.
export default {
  [actions.ApproveFeeDeposit]: TERM_AGNOSTIC,
  [actions.ActivateAnj]: 1,
  [actions.AppealRuling]: 1,
  [actions.ClaimRewards]: TERM_AGNOSTIC,
  [actions.ClaimSubscriptionFees]: TERM_AGNOSTIC,
  [actions.CommitVote]: 1,
  [actions.ConfirmAppeal]: 1,
  [actions.DeactivateAnj]: 1,
  [actions.DraftJury]: 0,
  [actions.ExecuteRuling]: 1,
  [actions.Heartbeat]: TERM_AGNOSTIC,
  [actions.LeakVote]: 1,
  [actions.RevealVote]: 1,
  [actions.SettleReward]: TERM_AGNOSTIC,
  [actions.SettleAppealDeposit]: TERM_AGNOSTIC,
  [actions.WithdrawAnj]: 0,
}
