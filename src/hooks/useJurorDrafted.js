import { dayjs } from '../utils/date-utils'
import { useWallet } from '../providers/Wallet'
import { useCourtClock } from '../providers/CourtClock'
import { useCurrentTermJurorDraftsSubscription } from './subscription-hooks'

export function useJurorDrafted({ pause }) {
  const wallet = useWallet()
  const { currentTermStartDate } = useCourtClock()

  const currnetTermStartTime = dayjs(currentTermStartDate).unix()

  const jurorDrafts = useCurrentTermJurorDraftsSubscription(
    wallet.account,
    currnetTermStartTime,
    pause
  )

  return jurorDrafts.length > 0
}
