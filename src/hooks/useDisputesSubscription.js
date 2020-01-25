import { useState } from 'react'
import { useSubscription } from 'urql'
import { transformResponseDisputeAttributes } from '../utils/dispute-utils'
import { AllDisputes } from '../queries/disputes'
import { useCourtConfig } from '../providers/CourtConfig'

export default function useDisputesSubscription(ids) {
  const [disputes, setDisputes] = useState([])
  const courtConfig = useCourtConfig()
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return setDisputes(
      response.disputes.map(dispute =>
        transformResponseDisputeAttributes(dispute, courtConfig)
      )
    )
  }
  useSubscription(
    {
      query: AllDisputes,
      variables: {},
    },
    handleSubscription
  )

  return disputes
}
