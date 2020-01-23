import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main } from '@aragon/ui'
import theme from './theme-court'

import MainView from './components/MainView'
import Web3ConnectProvider from './providers/Web3'
import { CourtConfigProvider } from './providers/CourtConfig'

import AppLoader from './components/AppLoader'
import Routes from './Routes'
import { ClockProvider } from './providers/Clock'

const App = () => {
  return (
    <BrowserRouter>
      <Main
        assetsUrl="/aragon-ui/"
        layout={false}
        scrollView={false}
        theme={theme}
      >
        <Web3ConnectProvider>
          <CourtConfigProvider>
            <ClockProvider>
              <MainView>
                <AppLoader>
                  <Routes />
                </AppLoader>
              </MainView>
            </ClockProvider>
          </CourtConfigProvider>
        </Web3ConnectProvider>
      </Main>
    </BrowserRouter>
  )
}

export default App
