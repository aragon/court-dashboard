import { useJurorActiveBalanceSubscription } from './subscription-hooks'
import { useCourtConfig } from '../providers/CourtConfig'

export default function useCanJurorVoteFinalRound(account, { pause }) {
  const { minActiveBalance } = useCourtConfig()

  const activeBalance = useJurorActiveBalanceSubscription(
    account?.toLowerCase(),
    pause
  )

  return activeBalance.gte(minActiveBalance)
}
