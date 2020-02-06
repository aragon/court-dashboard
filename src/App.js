import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Main, ToastHub } from '@aragon/ui'
import { CourtClockProvider } from './providers/CourtClock'
import theme from './theme-court'
import MainView from './components/MainView'
import Web3ConnectProvider from './providers/Web3'
import { CourtConfigProvider } from './providers/CourtConfig'
import AppLoader from './components/AppLoader'
import Routes from './Routes'
import { UseWalletProvider } from 'use-wallet'
import env, { PROVIDERS } from './environment'

const connectors = PROVIDERS.reduce((connectors, provider) => {
  if (provider.useWalletConf) {
    connectors[provider.id] = provider.useWalletConf
  }
  return connectors
}, {})

function App() {
  return (
    <UseWalletProvider chainId={env('CHAIN_ID')} connectors={connectors}>
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
                    <AppLoader>
                      <Routes />
                    </AppLoader>
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
