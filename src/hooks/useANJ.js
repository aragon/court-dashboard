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
  getTotalNotEffectiveByType,
} from '../utils/anj-movement-utils'

import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'
import { bigNum } from '../lib/math-utils'
import { useFirstANJActivation } from './query-hooks'
import { useConnectedAccount } from '../providers/Web3'

export function useANJBalances() {
  const { balances, movements } = useDashboardState()

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
    // We need to calulate the total not effective amount for the activa and inacitve balance
    // Note that we don't this for the wallet balance since all corresponding movements are done effective at the same
    // Note that this assumes the termDuration is less than 24hrs
    let movementType
    if (balanceType === anjBalanceTypes.Active) {
      movementType = anjMovementTypes.Activation
    } else if (balanceType === anjBalanceTypes.Inactive) {
      movementType = anjMovementTypes.Deactivation
    }

    let amountNotEffective = bigNum(0)

    if (movementType)
      amountNotEffective = getTotalNotEffectiveByType(movements, movementType)

    // Get the latest movement
    // NOTE: This could be changed in the future for the aggregate of all 24hrs movements
    let latestMovement = filteredMovements.shift()

    if (latestMovement) {
      const latestMovementType = anjMovementTypes[latestMovement.type]

      // If the latest movement for the inactive balance is a deactivation, we must check that the deactivation is effective
      if (latestMovementType === anjMovementTypes.Deactivation) {
        if (!latestMovement.isEffective) {
          // In case the deactivation is not effective, we'll get the second latest movement for the inactive balance
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
      amount: balance,
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

/**
 *
 * @param {*} options query options
 * @return {Boolean} true if account's first ANJ activation happened on current term
 */
export function useJurorFirstTimeANJActivation(options) {
  const connectedAccount = useConnectedAccount()
  const { currentTermId } = useClock()
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
