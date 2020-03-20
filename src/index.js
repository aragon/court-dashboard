import React from 'react'
import ReactDOM from 'react-dom'
import {
  createClient,
  Provider as UrqlProvider,
  cacheExchange,
  debugExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { captureMessage } from '@sentry/browser'
import { devtoolsExchange } from '@urql/devtools'
import App from './App'
import endpoints from './endpoints'
import initializeSentry from './sentry'

initializeSentry()

const [GRAPH_API_ENDPOINT_HTTP, GRAPH_API_ENDPOINT_WS] = endpoints()

const subscriptionClient = new SubscriptionClient(GRAPH_API_ENDPOINT_WS, {
  reconnect: true,
  reconnectionAttempts: 10,
})

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

ReactDOM.render(
  <UrqlProvider value={client}>
    <App />
  </UrqlProvider>,
  document.getElementById('root')
)
