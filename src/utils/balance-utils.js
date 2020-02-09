export function getTotalUnlockedActiveBalance({
  lockedBalance,
  activeBalance,
}) {
  return activeBalance.amount.sub(lockedBalance.amount)
}

export function getTotalLockedANJDistribution({
  lockedBalance,
  inactiveBalance,
}) {
  if (!lockedBalance.distribution && inactiveBalance.amountNotEffective.eq(0))
    return null

  return {
    lockedPerDispute: lockedBalance.distribution,
    inProcess: inactiveBalance.amountNotEffective,
  }
}

export function getTotalEffectiveInactiveBalance({
  inactiveBalance,
  deactivationBalance,
}) {
  return inactiveBalance.amount
    .add(deactivationBalance.amount)
    .sub(inactiveBalance.amountNotEffective)
}
