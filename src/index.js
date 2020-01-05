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

const subscriptionClient = new SubscriptionClient(
  'ws://127.0.0.1:8001/subgraphs/name/aragon/aragon-court-rpc',
  {}
)

const client = createClient({
  url: 'http://127.0.0.1:8000/subgraphs/name/aragon/aragon-court-rpc',
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
