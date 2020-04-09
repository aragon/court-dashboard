import { fetchExchange, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { captureMessage } from '@sentry/browser'
import endpoints from './endpoints'

const GRAPH_API_ENDPOINTS = endpoints()
const subscriptionClient = new SubscriptionClient(GRAPH_API_ENDPOINTS[1], {
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

export function getSubscriptionExchange() {
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
