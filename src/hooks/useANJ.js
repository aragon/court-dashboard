import { useMemo } from 'react'
import { useCourtClock } from '../providers/CourtClock'

import { useFirstANJActivation } from './query-hooks'
import { useConnectedAccount } from '../providers/Web3'
import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'

import {
  ANJBalance as anjBalanceTypes,
  ANJMovement as anjMovementTypes,
} from '../types/anj-types'
import {
  isMovementOf,
  convertMovement,
  isMovementEffective,
  getUpdatedLockedMovement,
  getLatestMovementByBalance,
  acceptedMovementsPerBalance,
  getAmountNotEffectiveByBalance,
} from '../utils/anj-movement-utils'
import { getTermStartTime } from '../utils/court-utils'
import { useCourtConfig } from '../providers/CourtConfig'

export function useANJBalances() {
  const { balances, movements } = useDashboardState()

  const {
    walletBalance,
    activeBalance,
    lockedBalance,
    inactiveBalance,
    deactivationBalance,
  } = balances || {}

  const convertedMovements = useConvertedMovements(movements)

  console.log('convertedMovements', convertedMovements)

  const convertedWalletBalance = useBalanceWithMovements(
    walletBalance,
    convertedMovements,
    anjBalanceTypes.Wallet
  )

  const convertedInactiveBalance = useBalanceWithMovements(
    inactiveBalance,
    convertedMovements,
    anjBalanceTypes.Inactive
  )

  const convertedActiveBalance = useBalanceWithMovements(
    activeBalance,
    convertedMovements,
    anjBalanceTypes.Active
  )

  const convertedLockedBalance = useMemo(() => {
    return { amount: lockedBalance }
  }, [lockedBalance])

  const convertedDeactivationBalance = useMemo(() => {
    return { amount: deactivationBalance }
  }, [deactivationBalance])

  // Since we pass the whole object through props to components, we should memoize it
  return useMemo(() => {
    if (!balances) {
      return null
    }

    return {
      walletBalance: convertedWalletBalance,
      inactiveBalance: convertedInactiveBalance,
      activeBalance: convertedActiveBalance,
      lockedBalance: convertedLockedBalance,
      deactivationBalance: convertedDeactivationBalance,
    }
  }, [
    balances,
    convertedActiveBalance,
    convertedDeactivationBalance,
    convertedInactiveBalance,
    convertedLockedBalance,
    convertedWalletBalance,
  ])
}

// Asummes movements in descending order of creation
function useConvertedMovements(movements) {
  const { currentTermId } = useCourtClock()
  const courtConfig = useCourtConfig()

  const effectiveStates = movements
    ? movements.map(mov => isMovementEffective(mov, currentTermId))
    : []
  const effectiveStatesKey = effectiveStates.join('')

  return useMemo(
    () => {
      if (!movements) {
        return null
      }

      // Since Activation, Deactivations and Slashing movements are effective on next term of creation
      // but only Deactivations don't update the balance immediately, we'll use another attr (isImmediate) to differentiate these cases
      return movements
        .map((mov, i) => {
          const isImmediate =
            anjMovementTypes[mov.type] !== anjMovementTypes.Deactivation

          let updatesBalanceAt = mov.createdAt
          if (!isImmediate && mov.effectiveTermId && effectiveStates[i]) {
            const termStartTimeMs = getTermStartTime(
              mov.effectiveTermId,
              courtConfig
            )
            updatesBalanceAt = termStartTimeMs / 1000
          }

          return {
            ...mov,
            isEffective: effectiveStates[i],
            updatesBalanceAt,
            isImmediate,
          }
        })
        .sort((mov1, mov2) => {
          // We are resorting movements by time they update the balance at
          if (mov1.updatesBalanceAt === mov2.updatesBalanceAt) {
            return mov2.createdAt - mov1.createdAt
          }

          return mov2.updatesBalanceAt - mov1.updatesBalanceAt
        })
    },
    [effectiveStatesKey, movements] //eslint-disable-line
  )
}

// Calculates the latest movement for each balance
// In case the balance is active or inactive, we must also calculate all non effective movements to get the effective balance at current term
function useBalanceWithMovements(balance, movements, balanceType) {
  const { balances } = useDashboardState()
  const { lockedBalance } = balances || {}

  const acceptedMovements = acceptedMovementsPerBalance.get(balanceType)
  const filteredMovements = useFilteredMovements(movements, acceptedMovements)

  return useMemo(() => {
    if (!balance) {
      return null
    }

    const amountNotEffective = getAmountNotEffectiveByBalance(
      movements,
      balanceType
    )

    let latestMovement = getLatestMovementByBalance(
      filteredMovements,
      balanceType
    )

    if (balanceType === anjBalanceTypes.Active) {
      if (lockedBalance && lockedBalance.gt(0))
        latestMovement = getUpdatedLockedMovement(lockedBalance, latestMovement)
    }

    return {
      amount: balance,
      amountNotEffective,
      latestMovement: convertMovement(acceptedMovements, latestMovement),
    }
  }, [
    acceptedMovements,
    balance,
    balanceType,
    filteredMovements,
    lockedBalance,
    movements,
  ])
}

function useFilteredMovements(movements, acceptedMovements) {
  return useMemo(() => {
    if (!movements) {
      return null
    }
    return movements.filter(movement => {
      return isMovementOf(acceptedMovements, anjMovementTypes[movement.type])
    })
  }, [acceptedMovements, movements])
}

/**
 *
 * @param {*} options query options
 * @return {Boolean} true if account's first ANJ activation happened on current term
 */
export function useJurorFirstTimeANJActivation(options) {
  const connectedAccount = useConnectedAccount()
  const { currentTermId } = useCourtClock()
  const firstANJActivation = useFirstANJActivation(
    connectedAccount.toLowerCase(),
    options
  )

  if (!firstANJActivation) return false

  const firstANJActivationTerm = parseInt(
    firstANJActivation.effectiveTermId,
    10
  )

  // Activation is effective on next term from when the activation was performed
  return firstANJActivationTerm === currentTermId + 1
}
