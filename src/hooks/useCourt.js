import { useSubscription } from 'urql'
import { CourtConfig as CourtConfigSubscription } from '../queries/court'

export function useCourtSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfigSubscription,
    variables: { id: courtAddress },
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

  return courtConfig
}
