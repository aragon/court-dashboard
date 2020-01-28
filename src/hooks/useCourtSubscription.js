import { useSubscription } from 'urql'
import { useState } from 'react'
import { CourtConfig } from '../queries/court'

export default function useCourtSubscription() {
  const [court, setCourt] = useState([])
  const handleSubscription = (lastResponse = [], response) => {
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
