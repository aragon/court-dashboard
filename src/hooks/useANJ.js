import { useMemo } from 'react'
import { useCourtClock } from '../providers/CourtClock'

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

  const {
    walletBalance,
    inactiveBalance,
    activeBalance,
    lockedBalance,
    deactivationBalance,
  } = balances || {}

  const convertedMovements = useConvertedMovements(movements)

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

  const effectiveStates = movements
    ? movements.map(mov => isMovementEffective(mov, currentTermId))
    : []
  const effectiveStatesKey = effectiveStates.join('')

  return useMemo(
    () => {
      if (!movements) {
        return null
      }

      return movements.map((mov, i) => ({
        ...mov,
        isEffective: effectiveStates[i],
      }))
    },
    [effectiveStatesKey, movements] //eslint-disable-line
  )
}

// Calculates the latest movement for each balance
// In case the balance is active or inactive, we must also calculate all non effective movements to get the effective balance at current term
function useBalanceWithMovements(balance, movements, balanceType) {
  const acceptedMovements = acceptedMovementsPerBalance.get(balanceType)
  const filteredMovements = useFilteredMovements(movements, acceptedMovements)

  return useMemo(() => {
    if (!balance) {
      return null
    }

    // We need to calulate the total not effective amount for the active and inactive balance
    // Note that we don't do this for the wallet balance since all its corresponding movements are done effective inmediately
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
  return useMemo(() => {
    if (!movements) {
      return null
    }
    return movements.filter(movement => {
      return isMovementOf(acceptedMovements, anjMovementTypes[movement.type])
    })
  }, [acceptedMovements, movements])
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
