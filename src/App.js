import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main, ToastHub } from '@aragon/ui'
import theme from './theme-court'

import { ActivityProvider } from './components/Activity/ActivityProvider'
import { CourtClockProvider } from './providers/CourtClock'
import { CourtConfigProvider } from './providers/CourtConfig'
import { TransactionQueueProvider } from './providers/TransactionQueue'
import { WalletProvider } from './providers/Wallet'

import AppLoader from './components/AppLoader'
import GlobalErrorHandler from './GlobalErrorHandler'
import MainView from './components/MainView'
import OnboardingLoader from './components/OnboardingLoader'
import Routes from './Routes'
import SignerPanel from './components/SignerPanel/SignerPanel'

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <ActivityProvider>
          <Main
            assetsUrl="/aragon-ui/"
            layout={false}
            scrollView={false}
            theme={theme}
          >
            <GlobalErrorHandler>
              <ToastHub threshold={1} timeout={1500}>
                <CourtConfigProvider>
                  <CourtClockProvider>
                    <TransactionQueueProvider>
                      <MainView>
                        <OnboardingLoader>
                          <AppLoader>
                            <Routes />
                          </AppLoader>
                        </OnboardingLoader>
                        <SignerPanel />
                      </MainView>
                    </TransactionQueueProvider>
                  </CourtClockProvider>
                </CourtConfigProvider>
              </ToastHub>
            </GlobalErrorHandler>
          </Main>
        </ActivityProvider>
      </BrowserRouter>
    </WalletProvider>
  )
}

export default App
