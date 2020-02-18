import { useCourtConfig } from '../providers/CourtConfig'
import { useActiveBalanceOfAt } from './useCourtContracts'

export default function useCanJurorVoteFinalRound(account, draftTermId) {
  const { minActiveBalance } = useCourtConfig()

  const activeBalance = useActiveBalanceOfAt(account, draftTermId)

  return activeBalance.gte(minActiveBalance)
}
