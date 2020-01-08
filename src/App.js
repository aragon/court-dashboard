import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Main } from '@aragon/ui'

import theme from './theme-court'

import MainView from './MainView'
import ErrorPage from './ErrorPage'

import Dashboard from './components/Dashboard/Dashboard'
import Tasks from './components/Tasks/Tasks'
import Disputes from './components/Disputes/Disputes'
import Web3ConnectProvider from './providers/Web3'
import { CourtConfigProvider } from './providers/CourtConfig'
import AppLoader from './components/AppLoader'

function App() {
  return (
    <BrowserRouter>
      <Main layout={false} theme={theme} scrollView={false}>
        <Web3ConnectProvider>
          <CourtConfigProvider>
            <AppLoader>
              <MainView>
                <Switch>
                  <Redirect exact from="/" to="/dashboard" />
                  <Route path="/dashboard" component={Dashboard} />
                  <Route exact path="/tasks" component={Tasks} />
                  <Route exact path="/disputes" component={Disputes} />
                  <Route component={ErrorPage} />
                </Switch>
              </MainView>
            </AppLoader>
          </CourtConfigProvider>
        </Web3ConnectProvider>
      </Main>
    </BrowserRouter>
  )
}

export default App
