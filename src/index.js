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
import { devtoolsExchange } from '@urql/devtools'
import * as Sentry from '@sentry/browser'
import App from './App'
import endpoints from './endpoints'
import env from './environment'
import { getNetworkName } from './lib/web3-utils'

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

if (env('SENTRY_DSN') && env('ENABLE_SENTRY')) {
  Sentry.init({
    dsn: env('SENTRY_DSN'),
    environment: getNetworkName(env('CHAIN_ID')),
    release: 'court-dashboard@' + env('BUILD'),
  })
}

ReactDOM.render(
  <UrqlProvider value={client}>
    <App />
  </UrqlProvider>,
  document.getElementById('root')
)
