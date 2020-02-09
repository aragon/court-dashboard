import { useConnectedAccount } from '../providers/Web3'
import { useCourtClock } from '../providers/CourtClock'
import dayjs from 'dayjs'
import { useCurrentTermJurorDraftsSubscription } from './subscription-hooks'

export function useJurorDrafted({ pause }) {
  const connectedAccount = useConnectedAccount()
  const { currentTermStartDate } = useCourtClock()

  const account = connectedAccount.toLowerCase()
  const currnetTermStartTime = dayjs(currentTermStartDate).unix()
  const jurorDrafts = useCurrentTermJurorDraftsSubscription(
    account,
    currnetTermStartTime,
    pause
  )

  return jurorDrafts.length > 0
}
