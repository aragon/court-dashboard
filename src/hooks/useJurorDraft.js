import dayjs from 'dayjs'
import { useWallet } from '../providers/Wallet'
import { useCourtClock } from '../providers/CourtClock'
import { useJurorDraftsSubscription } from './subscription-hooks'

export function useJurorDrafted({ pause }) {
  const wallet = useWallet()
  const { currentTermStartDate } = useCourtClock()

  const account = wallet.account.toLowerCase()
  const currnetTermStartTime = dayjs(currentTermStartDate).unix()

  const jurorDrafts = useJurorDraftsSubscription(
    account,
    currnetTermStartTime,
    pause
  )

  return jurorDrafts.length > 0
}
