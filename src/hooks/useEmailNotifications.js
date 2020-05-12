import { useEffect, useState } from 'react'
import { courtServerEndpoint } from '../endpoints'

const COURT_SERVER_ENDPOINT = courtServerEndpoint()

async function notificationServiceCall(
  method,
  address,
  apiModule,
  body,
  action
) {
  if (!address) {
    return
  }

  const endpoint = `${COURT_SERVER_ENDPOINT}/users/${address}${
    apiModule ? `/${apiModule}` : ''
  }${action ? `:${action}` : ''} `

  try {
    const rawResponse = await fetch(endpoint, {
      method: method,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    })

    const jsonResponse = await rawResponse.json()

    if (rawResponse.ok) {
      return {
        response: { ...jsonResponse },
        responseStatus: rawResponse.status,
        error: false,
        errorMsg: '',
      }
    }

    const errors = jsonResponse.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    return {
      responseStatus: rawResponse.status,
      error: true,
      errorMsg: errors,
    }
  } catch (err) {
    console.error(err)
    return { error: true, errorMsg: err }
  }
}

export function useSubscriptionDetails(address) {
  const [subscriptionDetails, setSubscriptionDetails] = useState({})
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!address) {
        return
      }

      const response = await notificationServiceCall('GET', address)
      setSubscriptionDetails(response)
      setFetching(false)
    }
    fetchSubscriptionDetails()
  }, [address])

  return {
    addressVerified: subscriptionDetails.response?.addressVerified,
    emailExists: subscriptionDetails.response?.emailExists,
    emailVerified: subscriptionDetails.response?.emailVerified,
    notificationsDisabled: subscriptionDetails.response?.notificationsDisabled,
    fetching,
    error: subscriptionDetails.error,
    errorMsg: subscriptionDetails.errorMsg,
  }
}
