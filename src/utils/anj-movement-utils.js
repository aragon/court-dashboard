import {
  ANJMovement as anjMovementTypes,
  ANJBalance as anjBalanceTypes,
  movementDirection,
  STAKE_ACTIVATION_MOVEMENT,
} from '../types/anj-types'
import { bigNum } from '../lib/math-utils'

/**
 * Function intended to group Stake and Activation movements that were created at the same time
 *  into one StakeActivation movement
 * This is needed since moving ANJ from wallet to Active Balance, two movements
 *  are performed (Wallet (stake) => InactiveBalance; Inactive balance (activate) => Active balance)
 * @param {Array} movements Array of original movements
 * @returns {Array} Resuling array of movements grouped by the logic described above
 */
export const groupMovements = movements => {
  // If the juror is activating from the wallet we need to just show an incoming movement in the Active balance
  // and an outgoing movement in the Wallet balance
  return movements.reduce(
    (movements, currentMovement, index, prevMovements) => {
      const prevMovement = prevMovements[index - 1]

      if (
        index > 0 &&
        anjMovementTypes[prevMovement.type] === anjMovementTypes.Activation &&
        anjMovementTypes[currentMovement.type] === anjMovementTypes.Stake &&
        prevMovement.createdAt === currentMovement.createdAt
      ) {
        movements[movements.length - 1].type = STAKE_ACTIVATION_MOVEMENT
        return movements
      }

      movements.push({
        ...currentMovement,
        effectiveTermId: parseInt(currentMovement.effectiveTermId, 10),
        amount: bigNum(currentMovement.amount),
      })

      return movements
    },
    []
  )
}

// The intention here is to know which movements types should correspond with each balance
export const acceptedMovementsPerBalance = new Map([
  [
    anjBalanceTypes.Wallet,
    [
      { type: anjMovementTypes.Stake, direction: movementDirection.Outgoing },
      { type: anjMovementTypes.Unstake, direction: movementDirection.Incoming },
      {
        type: anjMovementTypes.StakeActivation,
        direction: movementDirection.Outgoing,
      },
    ],
  ],
  [
    anjBalanceTypes.Inactive,
    [
      { type: anjMovementTypes.Stake, direction: movementDirection.Incoming },
      { type: anjMovementTypes.Unstake, direction: movementDirection.Outgoing },
      { type: anjMovementTypes.Reward, direction: movementDirection.Incoming },
      {
        type: anjMovementTypes.Activation,
        direction: movementDirection.Outgoing,
      },
      {
        type: anjMovementTypes.Deactivation,
        direction: movementDirection.Incoming,
      },
    ],
  ],
  [
    anjBalanceTypes.Active,
    [
      {
        type: anjMovementTypes.StakeActivation,
        direction: movementDirection.Incoming,
      },
      {
        type: anjMovementTypes.Activation,
        direction: movementDirection.Incoming,
      },
      {
        type: anjMovementTypes.Deactivation,
        direction: movementDirection.Outgoing,
      },
      {
        type: anjMovementTypes.DeactivationProcess,
        direction: movementDirection.Locked,
      },
      { type: anjMovementTypes.Lock, direction: movementDirection.Locked },
      { type: anjMovementTypes.Unlock, direction: movementDirection.Incoming },
      { type: anjMovementTypes.Slash, direction: movementDirection.Outgoing },
    ],
  ],
])

export function isMovementOf(movements, movementType) {
  return movements.some(movement => movement.type === movementType)
}

export function getMovementDirection(acceptedMovements, movementType) {
  const { direction } = acceptedMovements.find(
    elem => elem.type === movementType
  )

  return direction
}

export function isMovementEffective(movement, currentTermId) {
  if (!movement.effectiveTermId) return true

  return movement.effectiveTermId <= currentTermId
}

export function getTotalNotEffectiveByType(movements, movementType) {
  return movements
    .filter(
      mov => !mov.isEffective && anjMovementTypes[mov.type] === movementType
    )
    .reduce((acc, mov) => acc.add(mov.amount), bigNum(0))
}
