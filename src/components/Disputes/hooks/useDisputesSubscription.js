import { useState, useQuery } from 'react'
import { useSubscription } from 'urql'
import { reduceDispute } from '../reducer'
import { AllDisputes, JurorDrafts } from '../../../queries/disputes'

export default function useDisputesSubscription() {
  const [disputes, setDisputes] = useState([])
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not
     */
    return setDisputes(response.disputes.map(dispute => reduceDispute(dispute)))
  }
  useSubscription(
    {
      query: AllDisputes,
    },
    handleSubscription
  )

  return disputes
}

export function useJurorDraftQuery() {
  const [jurorDisputes, setJurorDisputes] = useState([])
  const [result] = useQuery({
    query: JurorDrafts,
    variables: { id: 'juror' },
  })
  if (!result.fetching) {
    setJurorDisputes(result.data.juror.drafts.map(draft => draft.round.dispute))
  }
  return jurorDisputes
}
