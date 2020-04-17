import { fetchExchange, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { captureMessage } from '@sentry/browser'
import env from './environment'
import endpoints from './endpoints'
import { mockFetchExchange, mockSubscriptionExchange } from './mock/exchanges'

const GRAPH_API_ENDPOINTS = endpoints()
const subscriptionClient = new SubscriptionClient(GRAPH_API_ENDPOINTS[1], {
  reconnect: !env('MOCK_DATA'),
  reconnectionAttempts: 10,
})

// Default exchanges
const DEFAULT_FETCH_EXCHANGE = fetchExchange
const DEFAULT_SUBSCRIPTION_EXCHANGE = subscriptionExchange({
  forwardSubscription: operation => subscriptionClient.request(operation),
})

export function getFetchExchange() {
  return env('MOCK_DATA') ? mockFetchExchange : DEFAULT_FETCH_EXCHANGE
}

export function getSubscriptionExchange() {
  return env('MOCK_DATA')
    ? mockSubscriptionExchange
    : DEFAULT_SUBSCRIPTION_EXCHANGE
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
