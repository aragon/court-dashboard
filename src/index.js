import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {
  createClient,
  Provider,
  cacheExchange,
  debugExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { devtoolsExchange } from '@urql/devtools'
import endpoints from './endpoints'

const [GRAPH_API_ENDPOINT_HTTP, GRAPH_API_ENDPOINT_WS] = endpoints()

const subscriptionClient = new SubscriptionClient(GRAPH_API_ENDPOINT_WS, {})

const client = createClient({
  url: GRAPH_API_ENDPOINT_HTTP,
  exchanges: [
    debugExchange,
    devtoolsExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
})
ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)
