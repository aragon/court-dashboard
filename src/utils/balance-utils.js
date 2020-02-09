export function getTotalUnlockedActiveBalance({
  activeBalance,
  lockedBalance,
}) {
  return activeBalance.amount.sub(lockedBalance.amount)
}

export function getTotalLockedActiveBalance({
  inactiveBalance,
  lockedBalance,
}) {
  return lockedBalance.amount.add(inactiveBalance.amountNotEffective)
}

export function getTotalEffectiveInactiveBalance({
  inactiveBalance,
  deactivationBalance,
}) {
  return inactiveBalance.amount
    .add(deactivationBalance.amount)
    .sub(inactiveBalance.amountNotEffective)
}
