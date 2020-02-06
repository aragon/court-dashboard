export function getTotalUnlockedActiveBalance({
  activeBalance,
  lockedBalance,
}) {
  return activeBalance.amount.sub(lockedBalance.amount)
}

export function getTotalEffectiveInactiveBalance({
  inactiveBalance,
  deactivationBalance,
}) {
  return inactiveBalance.amount
    .add(deactivationBalance.amount)
    .sub(inactiveBalance.amountNotEffective)
}
