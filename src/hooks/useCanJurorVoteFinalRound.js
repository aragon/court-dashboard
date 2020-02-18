import { useCourtConfig } from '../providers/CourtConfig'
import { useActiveBalanceOfAt } from './useCourtContracts'

export default function useCanJurorVoteFinalRound(
  draftTermId,
  account,
  maxAppealReached
) {
  const { minActiveBalance } = useCourtConfig()

  const activeBalance = useActiveBalanceOfAt(
    account?.toLowerCase(),
    draftTermId
  )

  return activeBalance.gte(minActiveBalance)
}
