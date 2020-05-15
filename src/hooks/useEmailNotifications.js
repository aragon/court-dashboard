import { useEffect, useState } from 'react'
import { getSubscriptionDetails } from '../services/servicesRequests'

export function useSubscriptionDetails(address) {
  const [subscriptionDetails, setSubscriptionDetails] = useState({})
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fetchSubscriptionDetails = async () => {
      if (!address) {
        return
      }

      if (!cancelled) {
        const response = await getSubscriptionDetails(address)
        setSubscriptionDetails(response)
        setFetching(false)
      }
    }
    fetchSubscriptionDetails()
    return () => {
      cancelled = true
    }
  }, [address])

  return {
    addressVerified: subscriptionDetails?.addressVerified,
    emailExists: subscriptionDetails?.emailExists,
    emailVerified: subscriptionDetails?.emailVerified,
    notificationsDisabled: subscriptionDetails?.notificationsDisabled,
    fetching,
    error: subscriptionDetails.error,
  }
}
