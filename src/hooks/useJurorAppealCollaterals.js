import { useMemo } from 'react'
import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'
import { bigNum } from '../lib/math-utils'
import { useConnectedAccount } from '../providers/Web3'
import { addressesEqual } from '../lib/web3-utils'

// Until the penalties aren't settled for the round, the appeal collaterals are still locked in the treasury
export default function useJurorAppealCollaterals() {
  const { appeals } = useDashboardState()
  const connectedAccount = useConnectedAccount()

  return useMemo(() => {
    if (!appeals) {
      return null
    }

    return appeals
      .filter(appeal => !appeal.round.settledPenalties)
      .map(({ round, maker, ...appeal }) => {
        const isMaker = addressesEqual(maker, connectedAccount)

        return {
          disputeId: round.dispute.id,
          amountStaked: bigNum(
            isMaker ? appeal.appealDeposit : appeal.confirmAppealDeposit
          ),
        }
      })
  }, [appeals, connectedAccount])
}
