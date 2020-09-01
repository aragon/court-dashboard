import { fetchExchange, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { captureMessage } from '@sentry/browser'
import { defaultSubgraphWsEndpoint } from './endpoints'

const subscriptionClient = new SubscriptionClient(defaultSubgraphWsEndpoint, {
  reconnect: true,
  reconnectionAttempts: 10,
})

// Default exchanges
const DEFAULT_FETCH_EXCHANGE = fetchExchange
const DEFAULT_SUBSCRIPTION_EXCHANGE = subscriptionExchange({
  forwardSubscription: operation => subscriptionClient.request(operation),
})

export function getFetchExchange() {
  return DEFAULT_FETCH_EXCHANGE
}

export function getSubscriptionExchange(resetSubscription) {
  if (resetSubscription) {
    subscriptionClient.close()
  }
  return DEFAULT_SUBSCRIPTION_EXCHANGE
}

let connectionAttempts = 0
subscriptionClient.onConnected(() => (connectionAttempts = 0))

// Check for connection errors and if reaches max attempts send error log to Sentry
subscriptionClient.onError(err => {
  const maxReconnectionAttempts = subscriptionClient.reconnectionAttempts

  if (maxReconnectionAttempts === ++connectionAttempts) {
    captureMessage(`Connection error, could not connect to ${err.target.url}`)
  }
  console.log('Retrying connection...')
})
