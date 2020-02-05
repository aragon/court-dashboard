import { useMemo } from 'react'
import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'
import { bigNum } from '../lib/math-utils'

// Until the penalties aren't settled for the round, the appeal collaterals are still locked in the treasury
export default function useJurorAppealCollaterals() {
  const { appeals } = useDashboardState()

  return useMemo(() => {
    if (!appeals) {
      return null
    }

    return appeals
      .filter(appeal => !appeal.round.settledPenalties)
      .map(({ round, maker, ...appeal }) => ({
        disputeId: round.dispute.id,
        amountStaked: bigNum(
          maker ? appeal.appealDeposit : appeal.confirmAppealDeposit
        ),
      }))
  }, [appeals])
}
