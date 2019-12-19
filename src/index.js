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
  'wss://api.thegraph.com/subgraphs/name/aragon/aragon-court-rinkeby',
  {}
)

const client = createClient({
  url: 'https://api.thegraph.com/subgraphs/name/aragon/aragon-court-rinkeby',
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
