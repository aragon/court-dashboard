import { bigExp } from '../helper'
import { ANJMovementType } from '../types'

export const jurorMovements = [
  {
    amount: bigExp('20'),
    effectiveTermId: 3,
    createdAt: '1',
    type: ANJMovementType.Activation,
  },
  {
    amount: bigExp('20'),
    effectiveTermId: 3,
    createdAt: '1',
    type: ANJMovementType.Stake,
  },
]

export const jurorBalances = {
  activeBalance: bigExp('4030'),
  lockedBalance: bigExp('400'),
  availableBalance: bigExp('5403'),
  deactivationBalance: bigExp('2453'),
  treasuryTokens: [],
  movements: jurorMovements,
}

export const jurorWalletBalance = { amount: bigExp('1000') }

function generateJurorsData() {
  
}

export const drafts = 
