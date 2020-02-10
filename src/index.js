import React from 'react'
import ReactDOM from 'react-dom'
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
import * as Sentry from '@sentry/browser'
import App from './App'
import endpoints from './endpoints'
import env from './environment'
import { getNetworkName } from './lib/web3-utils'

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

const sentryEnabled = !!(env('SENTRY_DSN') && env('ENABLE_SENTRY'))

if (sentryEnabled) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: getNetworkName(env('CHAIN_ID')),
    release: 'court-dashboard@' + env('BUILD'),
  })
}

let connectionAttempts = 0
subscriptionClient.onConnected(() => (connectionAttempts = 0))

// Check for connection errors and if reaches max attempts send error log to Sentry
subscriptionClient.onError(err => {
  const maxReconnectionAttempts = subscriptionClient.reconnectionAttempts

  if (sentryEnabled && maxReconnectionAttempts === ++connectionAttempts) {
    Sentry.captureMessage(
      `Connection error, could not connect to ${err.target.url}`
    )
  }
  console.log('Retrying connection...')
})

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)
