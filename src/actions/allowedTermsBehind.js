import actions from './court-action-types'

const TERM_AGNOSTIC = -1

// Some court actions cannot be executed if the court clock term is not synced or is more than a certain number of terms behind.
// This is a mapping of every action and its number of maximum allowed terms behind to be able to be executed.
export default {
  [actions.APPROVE_FEE_DEPOSIT]: TERM_AGNOSTIC,
  [actions.ACTIVATE_ANJ]: 1,
  [actions.APPEAL_RULING]: 1,
  [actions.CLAIM_REWARDS]: TERM_AGNOSTIC,
  [actions.CLAIM_SUBSCRIPTION_FEES]: TERM_AGNOSTIC,
  [actions.COMMIT_VOTE]: 1,
  [actions.CONFIRM_APPEAL]: 1,
  [actions.DEACTIVATE_ANJ]: 1,
  [actions.DRAFT_JURY]: 0,
  [actions.EXECUTE_RULING]: 1,
  [actions.HEARTBEAT]: TERM_AGNOSTIC,
  [actions.LEAK_VOTE]: 1,
  [actions.REVEAL_VOTE]: 1,
  [actions.SETTLE_REWARD]: TERM_AGNOSTIC,
  [actions.SETTLE_APPEAL_DEPOSIT]: TERM_AGNOSTIC,
  [actions.WITHDRAW_ANJ]: 0,
}
