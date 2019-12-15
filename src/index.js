import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
  createClient,
  Provider,
  cacheExchange,
  dedupExchange,
  fetchExchange,
} from 'urql'

import { devtoolsExchange } from '@urql/devtools'

const client = createClient({
  url: 'http://127.0.0.1:8000/subgraphs/name/aragon/aragon-court-rpc',
  exchanges: [dedupExchange, devtoolsExchange, cacheExchange, fetchExchange],
})

ReactDOM.render(
  <Provider value={client}>
    <App />
  </Provider>,
  document.getElementById('root')
)
