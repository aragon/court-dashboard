export const STAKE_ACTIVATION_MOVEMENT = 'StakeActivation'

export const ANJMovement = {
  Stake: Symbol('STAKE'),
  Unstake: Symbol('UNSTAKE'),
  Activation: Symbol('ACTIVATION'),
  [STAKE_ACTIVATION_MOVEMENT]: Symbol('StakeActivation'),
  Deactivation: Symbol('DEACTIVATION'),
  DeactivationProcess: Symbol('DEACTIVATION_PROCESS'),
  Lock: Symbol('LOCK'),
  Unlock: Symbol('UNLOCK'),
  Reward: Symbol('REWARD'),
  Slash: Symbol('SLASH'),
}

export const movementDirection = {
  Incoming: Symbol('INCOMING_MOVEMENT'),
  Outgoing: Symbol('OUTGOING_MOVEMENT'),
  Locked: Symbol('LOCKED_MOVEMENT'),
}

const stringMapping = {
  [ANJMovement.Stake]: {
    [movementDirection.Incoming]: 'Deposit',
    [movementDirection.Outgoing]: 'Withdrawal',
  },
  [ANJMovement.Unstake]: {
    [movementDirection.Incoming]: 'Deposit',
    [movementDirection.Outgoing]: 'Withdrawal',
  },
  [ANJMovement.Activation]: 'Activated',
  [ANJMovement.StakeActivation]: 'Activated',
  [ANJMovement.Deactivation]: 'Deactivated',
  [ANJMovement.DeactivationProcess]: 'Deactivation process',
  [ANJMovement.Lock]: 'Locked',
  [ANJMovement.Unlock]: 'Unlocked',
  [ANJMovement.Reward]: 'Rewards',
  [ANJMovement.Slash]: 'Slashed',
}

export function convertToString(symbol, direction) {
  const mapping = stringMapping[symbol]
  return typeof mapping === 'object' ? mapping[direction] : mapping
}

export const ANJBalance = {
  Wallet: Symbol('WALLET'),
  Inactive: Symbol('INACTIVE'),
  Active: Symbol('ACTIVE'),
}
