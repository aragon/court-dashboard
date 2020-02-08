import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main, ToastHub } from '@aragon/ui'
import theme from './theme-court'
import MainView from './components/MainView'
import { CourtClockProvider } from './providers/CourtClock'
import { CourtConfigProvider } from './providers/CourtConfig'
import { WalletProvider } from './providers/Wallet'
import AppLoader from './components/AppLoader'
import OnboardingLoader from './components/OnboardingLoader'
import Routes from './Routes'

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Main
          assetsUrl="/aragon-ui/"
          layout={false}
          scrollView={false}
          theme={theme}
        >
          <ToastHub threshold={1} timeout={1500}>
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
          </ToastHub>
        </Main>
      </BrowserRouter>
    </WalletProvider>
  )
}

export default App
