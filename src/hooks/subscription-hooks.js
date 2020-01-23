import { useState, useMemo } from 'react'
import { useSubscription } from 'urql'
import { CourtConfig } from '../queries/court'

import { OpenRounds } from '../queries/rounds'
import { reduceDispute } from '../components/Disputes/reducer'
import { AllDisputes, SingleDispute } from '../queries/disputes'
import { useCourtConfig } from '../providers/CourtConfig'

// Court config
export function useCourtSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfig,
    variables: { id: courtAddress },
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

  return courtConfig
}

// Single dispute
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

// All disputes
export function useDisputesSubscription() {
  const courtConfig = useCourtConfig()
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return response.disputes.map(dispute => reduceDispute(dispute, courtConfig))
  }

  const [result] = useSubscription(
    {
      query: AllDisputes,
    },
    handleSubscription
  )

  const disputes = result.data || []

  return { disputes, errors: result.errors }
}

export function useRoundsSubscription() {
  const [rounds, setRounds] = useState([])
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (rounds = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return setRounds(response.adjudicationRounds)
  }
  useSubscription(
    {
      query: OpenRounds,
    },
    handleSubscription
  )

  return rounds
}
