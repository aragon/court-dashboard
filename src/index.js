import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import App from './App'
import initializeSentry from './sentry'
import { SubGraphProvider } from './providers/Subgraph'

initializeSentry()

const GlobalStyle = createGlobalStyle`
  body img {
    user-select:none;
  }
`

ReactDOM.render(
  <SubGraphProvider>
    <GlobalStyle />
    <App />
  </SubGraphProvider>,
  document.getElementById('root')
)
