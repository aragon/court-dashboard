import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Main } from '@aragon/ui'

import NavBar from './NavBar'
import Header from './Header'
import ErrorPage from './ErrorPage'

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
              <Redirect from="/" to="/dashboard" />
              <Switch>
                <Route path="/dashboard" render={() => <div>dashboard</div>} />
                <Route exact path="/tasks" render={() => <div>tasks</div>} />
                <Route
                  exact
                  path="/disputes"
                  render={() => <div>disputes</div>}
                />
                <Route component={ErrorPage} />
              </Switch>
            </Main>
          </div>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
