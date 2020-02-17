import { useJurorActiveBalanceSubscription } from './subscription-hooks'
import { useCourtConfig } from '../providers/CourtConfig'
import { formatUnits } from '../lib/math-utils'

export default function useCanJurorVoteFinalRound(account, { pause }) {
  const { minActiveBalance } = useCourtConfig()

  const activeBalance = useJurorActiveBalanceSubscription(
    account?.toLowerCase(),
    pause
  )

  console.log(pause)
  console.log(formatUnits(activeBalance), formatUnits(minActiveBalance))

  return activeBalance.gte(minActiveBalance)
}
