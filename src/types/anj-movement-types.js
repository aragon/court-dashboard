export const ANJMovement = {
  Stake: Symbol('STAKE'),
  StakeActivation: Symbol('StakeActivation'),
  Unstake: Symbol('UNSTAKE'),
  Activation: Symbol('ACTIVATION'),
  Deactivation: Symbol('DEACTIVATION'),
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
  [ANJMovement.StakeActivation]: 'Activated',
  [ANJMovement.Unstake]: 'Unstaked',
  [ANJMovement.Activation]: 'Activated',
  [ANJMovement.Deactivation]: 'Deactivated',
  [ANJMovement.Lock]: 'Locked',
  [ANJMovement.Unlock]: 'Unlocked',
  [ANJMovement.Reward]: 'Rewards',
  [ANJMovement.Slash]: 'Slashed',
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}

export default ANJMovement
