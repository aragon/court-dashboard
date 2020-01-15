import { useMemo } from 'react'
import { useClock } from '../providers/Clock'

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
import { bigNum } from '../lib/math-utils'

export function useANJBalances() {
  const { balances, movements } = useBalances()

  const convertedMovements = useConvertedMovements(movements)

  const walletBalance = useBalanceWithMovements(
    balances.walletBalance,
    convertedMovements,
    anjBalanceTypes.Wallet
  )

  const inactiveBalance = useBalanceWithMovements(
    balances.inactiveBalance,
    convertedMovements,
    anjBalanceTypes.Inactive
  )

  const activeBalance = useBalanceWithMovements(
    balances.activeBalance,
    convertedMovements,
    anjBalanceTypes.Active
  )

  const lockedBalance = useMemo(() => {
    return { amount: balances.lockedBalance }
  }, [balances.lockedBalance])

  const deactivationBalance = useMemo(() => {
    return { amount: balances.deactivationBalance }
  }, [balances.deactivationBalance])

  // Since we pass the whole object through props to components, we should memoize it
  return useMemo(
    () => ({
      walletBalance,
      inactiveBalance,
      activeBalance,
      lockedBalance,
      deactivationBalance,
    }),
    [
      activeBalance,
      deactivationBalance,
      inactiveBalance,
      lockedBalance,
      walletBalance,
    ]
  )
}

// Asummes movements in descending order of creation
function useConvertedMovements(movements) {
  const { currentTermId } = useClock()

  const effectiveStates = movements.map(mov =>
    isMovementEffective(mov, currentTermId)
  )
  const effectiveStatesKey = effectiveStates.join('')

  return useMemo(
    () =>
      movements.map((mov, i) => ({
        ...mov,
        isEffective: effectiveStates[i],
      })),
    [effectiveStatesKey, movements] //eslint-disable-line
  )
}

// Calculates the latest movement for each balance
// In case the balance is the active, we must also calculate all non effective movements to get the effective active balance at current term
function useBalanceWithMovements(balance, movements, balanceType) {
  const acceptedMovements = acceptedMovementsPerBalance.get(balanceType)
  const filteredMovements = useFilteredMovements(movements, acceptedMovements)

  return useMemo(() => {
    // To calculate the effective active balance  we must get all non effective activation movements
    // We need to do this since the active balance from the graph already has included this not yet effective movement amounts
    // Note that this assumes the termDuration is less than 24hrs
    let amountNotEffective = bigNum(0)

    // TODO: Implement a more generic way
    if (balanceType === anjBalanceTypes.Active) {
      amountNotEffective = movements
        .filter(
          mov =>
            !mov.isEffective &&
            anjMovementTypes[mov.type] === anjMovementTypes.Activation
        )
        .reduce((acc, mov) => acc.add(mov.amount), amountNotEffective)
    }

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
      amountNotEffective,
      latestMovement: convertMovement(acceptedMovements, latestMovement),
    }
  }, [acceptedMovements, balance, balanceType, filteredMovements, movements])
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
