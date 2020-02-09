import dayjs from 'dayjs'

import { useWallet } from '../providers/Wallet'
import { useCourtClock } from '../providers/CourtClock'
import { useCurrentTermJurorDraftsSubscription } from './subscription-hooks'

export function useJurorDrafted({ pause }) {
  const wallet = useWallet()
  const { currentTermStartDate } = useCourtClock()

  const account = wallet.account.toLowerCase()
  const currnetTermStartTime = dayjs(currentTermStartDate).unix()

  const jurorDrafts = useCurrentTermJurorDraftsSubscription(
    account,
    currnetTermStartTime,
    pause
  )

  return jurorDrafts.length > 0
}
