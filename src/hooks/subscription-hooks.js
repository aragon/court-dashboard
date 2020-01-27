import { useMemo } from 'react'
import { useSubscription } from 'urql'

import { CourtConfig } from '../queries/court'
import { OpenTasks } from '../queries/tasks'
import { AllDisputes, SingleDispute } from '../queries/disputes'

import { transformResponseDisputeAttributes } from '../utils/dispute-utils'
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
    () =>
      data && data.dispute
        ? transformResponseDisputeAttributes(data.dispute)
        : null,
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
    return response.disputes.map(dispute =>
      transformResponseDisputeAttributes(dispute, courtConfig)
    )
  }

  const [result] = useSubscription(
    {
      query: AllDisputes,
    },
    handleSubscription
  )
  const disputes = result.data || []

  return { disputes, errors: result.errors, fetching: result.fetching }
}

export function useTasksSubscription() {
  // 1- Committing, 4-Confirming Appeal , 5- Ended
  const subscriptionVariables = { state: [1, 4] }

  const [{ data, error }] = useSubscription({
    query: OpenTasks,
    variables: subscriptionVariables,
  })

  const tasks = data ? data.adjudicationRounds : []

  return { tasks, errors: error }
}
