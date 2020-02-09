import { useMemo } from 'react'
import { bigNum } from '../lib/math-utils'
import { useWallet } from '../providers/Wallet'
import { addressesEqual } from '../lib/web3-utils'
import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'

// Until the penalties aren't settled for the round, the appeal collaterals are still locked in the treasury
export default function useJurorAppealCollaterals() {
  const { appeals } = useDashboardState()
  const { account } = useWallet()

  return useMemo(() => {
    if (!appeals) {
      return null
    }

    return appeals
      .filter(appeal => !appeal.round.settledPenalties)
      .map(({ round, maker, ...appeal }) => {
        const isMaker = addressesEqual(maker, account)

        return {
          disputeId: round.dispute.id,
          amountStaked: bigNum(
            isMaker ? appeal.appealDeposit : appeal.confirmAppealDeposit
          ),
        }
      })
  }, [appeals, account])
}
