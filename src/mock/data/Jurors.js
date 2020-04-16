import { accounts, bigExp } from '../helper'
import { ANJMovementType } from '../types'
import courtConfig from './CourtConfig'

const ACTIVE_BASE_BALANCE = '10000'
const numberOfJurors = 4

const JUROR_DEFAULT_DATA = {
  // Wallet balance (from the subgraph we actually don't get this amount from the juror entity itself
  // but in this case since we are mocking data doesn't really matter)
  walletBalance: '0',
  activeBalance: '0',
  lockedBalance: '0',
  availableBalance: '0',
  deactivationBalance: '0',
  treasuryTokens: [],
}

function generateJurors() {
  return accounts.slice(0, numberOfJurors).map((account, index) => {
    const activeBalance = bigExp(`${ACTIVE_BASE_BALANCE * (index + 1)}`)

    // The last account will be a new active juror, which means that the activation must be effective on the next term
    const newJuror = index === numberOfJurors - 1
    const activationEffectiveTermId = newJuror ? courtConfig.currentTerm + 1 : 1

    return {
      ...JUROR_DEFAULT_DATA,
      id: account,
      activeBalance,

      // Mimicking ANJ activation from wallet
      anjMovements: [
        {
          amount: activeBalance,
          effectiveTermId: activationEffectiveTermId,
          type: ANJMovementType.Activation,
        },
        {
          amount: activeBalance,
          effectiveTermId: activationEffectiveTermId,
          type: ANJMovementType.Stake,
        },
      ],

      drafts: [],
    }
  })
}

export default generateJurors()
