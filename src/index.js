import React from 'react'
import ReactDOM from 'react-dom'
import {
  createClient,
  Provider as UrqlProvider,
  cacheExchange,
  debugExchange,
} from 'urql'
import { getFetchExchange, getSubscriptionExchange } from './graphql-exchanges'

import { devtoolsExchange } from '@urql/devtools'
import { createGlobalStyle } from 'styled-components'
import App from './App'
import { defaultSubgraphEndpoint } from './networks'
import initializeSentry from './sentry'

initializeSentry()

const client = createClient({
  url: defaultSubgraphEndpoint,
  exchanges: [
    debugExchange,
    devtoolsExchange,
    cacheExchange,
    getFetchExchange(),
    getSubscriptionExchange(),
  ],
})

console.log('client ', client)
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
