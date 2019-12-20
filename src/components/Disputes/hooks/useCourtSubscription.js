import { useSubscription } from 'urql'
import { useState } from 'react'
// import { reduceDispute } from '../reducer'
import { CourtConfig } from '../../../queries/court'

export default function useCourtSubscription() {
  const [court, setCourt] = useState([])
  console.log('subscribinnnngg')
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = [], response) => {
    console.log('Subscription COURT', response)
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return setCourt(response.courtConfig)
  }
  useSubscription(
    {
      query: CourtConfig,
    },
    handleSubscription
  )
  return court
}
