export const ANJMovementType = {
  Stake: 'Stake',
  Unstake: 'Unstake',
  Activation: 'Activation',
  Deactivation: 'Deactivation',
  Lock: 'Lock',
  Unlock: 'Unlock',
  Reward: 'Reward',
  Slash: 'Slash',
}

export const DisputeState = {
  Evidence: 'Evidence',
  Drafting: 'Drafting',
  Adjudicating: 'Adjudicating',
  Ruled: 'Ruled',
}

export const AdjudicationState = {
  Invalid: 'Invalid',
  Committing: 'Committing',
  Revealing: 'Revealing',
  Appealing: 'Appealing',
  ConfirmingAppeal: 'ConfirmingAppeal',
  Ended: 'Ended',
}

export const getAdjudicationStateNumber = state => {
  return Object.values(AdjudicationState).findIndex(
    adjudicationState => adjudicationState === state
  )
}

export const RulingOptions = {
  Missing: 'Missing',
  Leaked: 'Leaked',
  Refused: 'Refused',
  Against: 'Against',
  InFavor: 'InFavor',
}

export const getRulingOptionNumber = option => {
  return Object.values(RulingOptions).findIndex(
    rulingPption => rulingPption === option
  )
}
