export const ANJMovement = {
  Stake: Symbol('STAKE'),
  Unstake: Symbol('UNSTAKE'),
  Activation: Symbol('ACTIVATION'),
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
  [ANJMovement.Stake]: 'Staked',
  [ANJMovement.Unstake]: 'Unstaked',
  [ANJMovement.Activation]: 'Activated',
  [ANJMovement.Deactivation]: 'Deactivated',
  [ANJMovement.DeactivationProcess]: 'Deactivation process',
  [ANJMovement.Lock]: 'Locked',
  [ANJMovement.Unlock]: 'Unlocked',
  [ANJMovement.Reward]: 'Rewards',
  [ANJMovement.Slash]: 'Slashed',
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}

export const ANJBalance = {
  Wallet: Symbol('WALLET'),
  Inactive: Symbol('INACTIVE'),
  Active: Symbol('ACTIVE'),
}
