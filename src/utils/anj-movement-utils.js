import {
  ANJMovement as anjMovementTypes,
  ANJBalance as anjBalanceTypes,
  movementDirection,
} from '../types/anj-types'
import { bigNum } from '../lib/math-utils'

// The intention here is to know which movements types should correspond with each balance
export const acceptedMovementsPerBalance = new Map([
  [
    anjBalanceTypes.Wallet,
    [
      { type: anjMovementTypes.Stake, direction: movementDirection.Outgoing },
      { type: anjMovementTypes.Unstake, direction: movementDirection.Incoming },
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
