import { fetchExchange, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import env from './environment'
import endpoints from './endpoints'
import { mockFetchExchange, mockSubscriptionExchange } from './mock/exchanges/'

const DEFAULT_FETCH_EXCHANGE = fetchExchange
const DEFAULT_SUBSCRIPTION_EXCHANGE = subscriptionExchange({
  forwardSubscription: operation => subscriptionClient.request(operation),
})
const GRAPH_API_ENDPOINTS = endpoints()

export const subscriptionClient = new SubscriptionClient(
  GRAPH_API_ENDPOINTS[1],
  {
    reconnect: true,
    reconnectionAttempts: 10,
  }
)

export function getFetchExchange() {
  return env('MOCK_DATA') ? mockFetchExchange : DEFAULT_FETCH_EXCHANGE
}

export function getSubscriptionExchange() {
  return env('MOCK_DATA')
    ? mockSubscriptionExchange
    : DEFAULT_SUBSCRIPTION_EXCHANGE
}
