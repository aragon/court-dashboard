import {
  ACCOUNT_STATUS_ANONYMUS,
  ACCOUNT_STATUS_JUROR_ACTIVE,
  ACCOUNT_STATUS_JUROR_INACTIVE,
} from '../types/account-status-types'

const HIGH_PROBABILITY_BASE = 0.1

export function getAccountStatus(balances, minActiveBalance) {
  const { activeBalance } = balances

  if (activeBalance.amount.gte(minActiveBalance))
    return ACCOUNT_STATUS_JUROR_ACTIVE

  if (!isANJHolder(balances)) return ACCOUNT_STATUS_ANONYMUS

  return ACCOUNT_STATUS_JUROR_INACTIVE
}

function isANJHolder(balances) {
  return Object.values(balances).reduce(
    (isHolder, balance) => isHolder || balance.amount.gt(0),
    false
  )
}

export function getProbabilityText(probability) {
  return probability >= HIGH_PROBABILITY_BASE ? 'High' : 'Low'
}
