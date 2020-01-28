import { useConnectedAccount } from '../providers/Web3'
import { useClock } from '../providers/Clock'
import dayjs from 'dayjs'
import { useJurorDraftsSubscription } from './subscription-hooks'

export function useJurorDrafted({ pause }) {
  const connectedAccount = useConnectedAccount()
  const { currentTermStartDate } = useClock()

  const account = connectedAccount.toLowerCase()
  const currnetTermStartTime = dayjs(currentTermStartDate).unix()
  const jurorDrafts = useJurorDraftsSubscription(
    account,
    currnetTermStartTime,
    pause
  )

  return jurorDrafts.length > 0
}
