import { useMemo } from 'react'
import useNow from './useNow'

import {
  ANJMovement as anjMovementTypes,
  ANJBalance as anjBalanceTypes,
} from '../types/anj-types'
import {
  acceptedMovementsPerBalance,
  isMovementOf,
  getMovementDirection,
  isMovementEffective,
} from '../utils/anj-movement-utils'

import { useBalances } from '../components/Dashboard/BalancesProvider'
import { useCourtConfig } from '../providers/CourtConfig'

export function useANJBalances() {
  const { balances, movements } = useBalances()

  return useLatestMovements(balances, movements)
}

// Asummes movements in descending order of creation
function useLatestMovements(balances, movements) {
  const now = useNow()
  const courtConfig = useCourtConfig()

  const effectiveStates = movements.map(mov =>
    isMovementEffective(mov, now, courtConfig)
  )
  const effectiveStatesKey = effectiveStates.join('')

  const convertedMovements = useMemo(
    () =>
      movements.map((mov, i) => ({
        ...mov,
        isEffective: effectiveStates[i],
      })),
    [effectiveStatesKey, movements] //eslint-disable-line
  )

  const walletBalance = useBalanceWithLatestMovement(
    balances.walletBalance,
    convertedMovements,
    anjBalanceTypes.Wallet
  )

  const inactiveBalance = useBalanceWithLatestMovement(
    balances.inactiveBalance,
    convertedMovements,
    anjBalanceTypes.Inactive
  )

  const activeBalance = useBalanceWithLatestMovement(
    balances.activeBalance,
    convertedMovements,
    anjBalanceTypes.Active
  )

  // Since we pass the whole object through props to components, we should memoize it
  return useMemo(() => ({ walletBalance, inactiveBalance, activeBalance }), [
    activeBalance,
    inactiveBalance,
    walletBalance,
  ])
}

// Returns balance with latest movement (in case of any)
function useBalanceWithLatestMovement(balance, movements, balanceType) {
  const acceptedMovements = acceptedMovementsPerBalance.get(balanceType)
  const filteredMovements = useFilteredMovements(movements, acceptedMovements)

  return useMemo(() => {
    let latestMovement = filteredMovements.shift()
    let newBalance = balance

    if (latestMovement) {
      const latestMovementType = anjMovementTypes[latestMovement.type]

      // If the latest movement for the inactive balance is a deactivation, we must check that the deactivation is effective
      if (latestMovementType === anjMovementTypes.Deactivation) {
        if (latestMovement.isEffective) {
          if (balanceType === anjBalanceTypes.Inactive) {
            // In case it's effective we'll update the inactive balance
            // Note that this means that the deactivation request has not been processed
            newBalance = newBalance.add(latestMovement.amount)
          }
        } else {
          // In case the deactivation is not effective, we'll get the second latest movement for the inactive balance and not update the total inactive
          if (balanceType === anjBalanceTypes.Inactive) {
            latestMovement = filteredMovements.shift()
          } else {
            // In case the deactivation is not effective, we'll show a deactivation process movement for the active Balance
            // Deactivation is between active and inactive balance so we can make sure that the current balanceType is the active
            latestMovement = {
              ...latestMovement,
              type: anjMovementTypes.DeactivationProcess,
            }
          }
        }
      }
    }

    return {
      amount: newBalance,
      latestMovement: convertMovement(acceptedMovements, latestMovement),
    }
  }, [acceptedMovements, balance, balanceType, filteredMovements])
}

function useFilteredMovements(movements, acceptedMovements) {
  const filteredMovements = useMemo(
    () =>
      movements.filter(movement =>
        isMovementOf(acceptedMovements, anjMovementTypes[movement.type])
      ),
    [acceptedMovements, movements]
  )

  return filteredMovements
}

function convertMovement(acceptedMovements, movement) {
  if (!movement) return null

  const movementType =
    typeof movement.type === 'symbol'
      ? movement.type
      : anjMovementTypes[movement.type]

  const direction = getMovementDirection(acceptedMovements, movementType)

  return {
    type: movementType,
    amount: movement.amount,
    direction,
  }
}
