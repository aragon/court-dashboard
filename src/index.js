import React from 'react'
import ReactDOM from 'react-dom'
import { captureMessage } from '@sentry/browser'
import { devtoolsExchange } from '@urql/devtools'
import {
  createClient,
  Provider as UrqlProvider,
  cacheExchange,
  debugExchange,
} from 'urql'

import App from './App'

import endpoints from './endpoints'
import initializeSentry from './sentry'
import {
  getFetchExchange,
  getSubscriptionExchange,
  subscriptionClient,
} from './exchanges'

initializeSentry()

const [GRAPH_API_ENDPOINT_HTTP] = endpoints()

const client = createClient({
  url: GRAPH_API_ENDPOINT_HTTP,
  exchanges: [
    debugExchange,
    devtoolsExchange,
    cacheExchange,
    getFetchExchange(),
    getSubscriptionExchange(),
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
