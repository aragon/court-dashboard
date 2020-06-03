import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import App from './App'
import initializeSentry from './sentry'
import { checkMigrations } from './migrations'
import { SubGraphProvider } from './providers/Subgraph'

initializeSentry()
checkMigrations()

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
