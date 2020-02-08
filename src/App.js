import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main, ToastHub } from '@aragon/ui'
import { CourtClockProvider } from './providers/CourtClock'
import theme from './theme-court'
import MainView from './components/MainView'
import Web3ConnectProvider from './providers/Web3'
import { CourtConfigProvider } from './providers/CourtConfig'
import AppLoader from './components/AppLoader'
import OnboardingLoader from './components/OnboardingLoader'
import Routes from './Routes'
import { UseWalletProvider } from 'use-wallet'
import { getUseWalletConnectors } from './lib/web3-utils'
import env from './environment'

function App() {
  return (
    <UseWalletProvider
      chainId={env('CHAIN_ID')}
      connectors={getUseWalletConnectors()}
    >
      <BrowserRouter>
        <Main
          assetsUrl="/aragon-ui/"
          layout={false}
          scrollView={false}
          theme={theme}
        >
          <ToastHub threshold={1} timeout={1500}>
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
          </ToastHub>
        </Main>
      </BrowserRouter>
    </UseWalletProvider>
  )
}

export default App
