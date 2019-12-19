import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Main } from '@aragon/ui'

import theme from './theme-court'

import MainView from './MainView'
import ErrorPage from './ErrorPage'

import Dashboard from './components/Dashboard/Dashboard'
import Tasks from './components/Tasks/Tasks'
import Disputes from './components/Disputes/Disputes'

function App() {
  return (
    <BrowserRouter>
      <Main layout={false} theme={theme}>
        <MainView>
          <Redirect from="/" to="/dashboard" />
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route exact path="/tasks" component={Tasks} />
            <Route exact path="/disputes" component={Disputes} />
            <Route component={ErrorPage} />
          </Switch>
        </MainView>
      </Main>
    </BrowserRouter>
  )
}

export default App
