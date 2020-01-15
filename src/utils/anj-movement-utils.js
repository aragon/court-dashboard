import {
  ANJMovement as anjMovementTypes,
  ANJBalance as anjBalanceTypes,
  movementDirection,
} from '../types/anj-types'
import { getTermStartDate } from './court-utils'

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
      { type: anjMovementTypes.Rewards, direction: movementDirection.Incoming },
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

export function isMovementEffective(movement, now, { terms, termDuration }) {
  if (!movement.effectiveTermId) return true

  const effectiveTermStartDate = getTermStartDate(
    movement.effectiveTermId,
    terms,
    termDuration
  )

  return effectiveTermStartDate <= now
}
