import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Main } from '@aragon/ui'

import NavBar from './NavBar'
import Header from './Header'
import ErrorPage from './ErrorPage'

import Dashboard from './components/Dashboard/Dashboard'
import Tasks from './components/Tasks/Tasks'
import Disputes from './components/Disputes/Disputes'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <div
          css={`
            display: flex;
          `}
        >
          <NavBar />
          <div
            css={`
              flex-grow: 1;
            `}
          >
            <Main>
              <div
                css={`
                  padding-bottom: 48px;
                `}
              >
                <Redirect from="/" to="/dashboard" />
                <Switch>
                  <Route path="/dashboard" component={Dashboard} />
                  <Route exact path="/tasks" component={Tasks} />
                  <Route exact path="/disputes" component={Disputes} />
                  <Route component={ErrorPage} />
                </Switch>
              </div>
            </Main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
