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
import endpoints from './endpoints'
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
