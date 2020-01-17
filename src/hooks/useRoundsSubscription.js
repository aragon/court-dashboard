import { useState } from 'react'
import { useSubscription } from 'urql'
import { OpenRounds } from '../queries/rounds'

export default function useRoundsSubscription() {
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
