import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main, ToastHub } from '@aragon/ui'
import theme from './theme-court'
import AppLoader from './components/AppLoader'
import GlobalErrorHandler from './GlobalErrorHandler'
import MainView from './components/MainView'
import OnboardingLoader from './components/OnboardingLoader'
import EmailNotificationsLoader from './components/EmailNotificationsLoader'
import RequestPanel from './components/RequestPanel/RequestPanel'
import Routes from './Routes'
import { ActivityProvider } from './components/Activity/ActivityProvider'
import { CourtClockProvider } from './providers/CourtClock'
import { CourtConfigProvider } from './providers/CourtConfig'
import { RequestQueueProvider } from './providers/RequestQueue'
import { WalletProvider } from './providers/Wallet'

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
                    <RequestQueueProvider>
                      <MainView>
                        <OnboardingLoader>
                          <EmailNotificationsLoader />
                          <AppLoader>
                            <Routes />
                          </AppLoader>
                        </OnboardingLoader>
                        <RequestPanel />
                      </MainView>
                    </RequestQueueProvider>
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
