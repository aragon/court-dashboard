import { useMemo } from 'react'
import { useSubscription } from 'urql'
import { transformResponseDisputeAttributes } from '../utils/dispute-utils'
import { SingleDispute } from '../queries/disputes'

export default function useSingleDisputeSubscription(id) {
  const [{ data, error }] = useSubscription({
    query: SingleDispute,
    variables: { id },
  })

  const dispute = useMemo(
    () =>
      data && data.dispute
        ? transformResponseDisputeAttributes(data.dispute)
        : null,
    [data]
  )

  return { dispute, fetching: !data && !error, error }
}
