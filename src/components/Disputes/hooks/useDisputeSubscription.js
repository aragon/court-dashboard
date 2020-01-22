import { useMemo } from 'react'
import { useSubscription } from 'urql'
import { reduceDispute } from '../reducer'
import { SingleDispute } from '../../../queries/disputes'

export default function useSingleDisputeSubscription(id) {
  const [
    {
      // TODO: check if we can get the equivalent of `fetching`,
      // but for the initial query.
      // fetching,
      data,
      error,
    },
  ] = useSubscription({
    query: SingleDispute,
    variables: { id },
  })

  const dispute = useMemo(
    () => (data && data.dispute ? reduceDispute(data.dispute) : null),
    [data]
  )

  return { dispute, fetching: !dispute && !error, error }
}
