import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main } from '@aragon/ui'
import theme from './theme-court'
import MainView from './components/MainView'
import Web3ConnectProvider from './providers/Web3'
import { CourtConfigProvider } from './providers/CourtConfig'
import AppLoader from './components/AppLoader'
import OnboardingLoader from './components/OnboardingLoader'
import Routes from './Routes'
import { CourtClockProvider } from './providers/CourtClock'

function App() {
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
            <CourtClockProvider>
              <MainView>
                <OnboardingLoader>
                  <AppLoader>
                    <Routes />
                  </AppLoader>
                </OnboardingLoader>
              </MainView>
            </CourtClockProvider>
          </CourtConfigProvider>
        </Web3ConnectProvider>
      </Main>
    </BrowserRouter>
  )
}

export default App
