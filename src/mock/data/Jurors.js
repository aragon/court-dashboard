import { accounts } from '../helper'
import courtConfig from './CourtConfig'
import { ANJMovementType } from '../types'
import { bigNum } from '../../lib/math-utils'

const MIN_ACTIVE_BASE_MULTIPLIER = '10'
const numberOfJurors = 3

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
    const activeBalance = bigNum(courtConfig.minActiveBalance).mul(
      MIN_ACTIVE_BASE_MULTIPLIER * (index + 1)
    )

    return {
      ...JUROR_DEFAULT_DATA,
      id: account,
      activeBalance,

      // Mimicking ANJ activation from wallet
      anjMovements: [
        {
          amount: activeBalance,
          effectiveTermId: 1,
          type: ANJMovementType.Activation,
        },
        {
          amount: activeBalance,
          effectiveTermId: 1,
          type: ANJMovementType.Stake,
        },
      ],

      drafts: [],
    }
  })
}

export default generateJurors()
