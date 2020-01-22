import { useMemo } from 'react'
import { useSubscription } from 'urql'
import { reduceDispute } from '../reducer'
import { SingleDispute } from '../../../queries/disputes'

export default function useSingleDisputeSubscription(id) {
  const [{ data, error }] = useSubscription({
    query: SingleDispute,
    variables: { id },
  })

  const dispute = useMemo(
    () => (data && data.dispute ? reduceDispute(data.dispute) : null),
    [data]
  )

  return { dispute, fetching: !data && !error, error }
}
