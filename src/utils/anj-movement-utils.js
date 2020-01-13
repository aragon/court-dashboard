import anjMovementTypes, {
  movementDirection,
} from '../types/anj-movement-types'

export const walletMovements = [
  { type: anjMovementTypes.Stake, direction: movementDirection.Outgoing },
  { type: anjMovementTypes.Unstake, direction: movementDirection.Incoming },
]
export const inactiveBalanceMovements = [
  { type: anjMovementTypes.Stake, direction: movementDirection.Incoming },
  { type: anjMovementTypes.Unstake, direction: movementDirection.Outgoing },
  { type: anjMovementTypes.Rewards, direction: movementDirection.Incoming },
  { type: anjMovementTypes.Activation, direction: movementDirection.Outgoing },
  {
    type: anjMovementTypes.Deactivation,
    direction: movementDirection.Incoming,
  },
]
export const activeBalanceMovements = [
  { type: anjMovementTypes.Activation, direction: movementDirection.Incoming },
  {
    type: anjMovementTypes.Deactivation,
    direction: movementDirection.Outgoing,
  },
  { type: anjMovementTypes.Lock, direction: movementDirection.Locked },
  { type: anjMovementTypes.Unlock, direction: movementDirection.Incoming },
  { type: anjMovementTypes.Slash, direction: movementDirection.Outgoing },
]
