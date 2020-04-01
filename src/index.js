import React from 'react'
import ReactDOM from 'react-dom'
import { captureMessage } from '@sentry/browser'
import { devtoolsExchange } from '@urql/devtools'
import { createGlobalStyle } from 'styled-components'
import {
  createClient,
  Provider as UrqlProvider,
  cacheExchange,
  debugExchange,
} from 'urql'

import App from './App'

import endpoints from './endpoints'
import env from './environment'
import {
  getFetchExchange,
  getSubscriptionExchange,
  subscriptionClient,
} from './exchanges'
import initializeSentry from './sentry'

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
  if (env('MOCK_DATA')) {
    return
  }

  const maxReconnectionAttempts = subscriptionClient.reconnectionAttempts

  if (maxReconnectionAttempts === ++connectionAttempts) {
    captureMessage(`Connection error, could not connect to ${err.target.url}`)
  }
  console.log('Retrying connection...')
})

const GlobalStyle = createGlobalStyle`
  body img {
    user-select:none;
  }
`

ReactDOM.render(
  <UrqlProvider value={client}>
    <GlobalStyle />
    <App />
  </UrqlProvider>,
  document.getElementById('root')
)
