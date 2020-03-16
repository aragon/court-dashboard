import React from 'react'
import PropTypes from 'prop-types'
import * as Sentry from '@sentry/browser'
import GenericError from './Errors/GenericError'
import GlobalErrorScreen from './Errors/GlobalErrorScreen'
import DisputeNotFoundError from './Disputes/DisputeNotFoundError'

import env from '../environment'
import { DisputeNotFound } from '../errors'
import { getNetworkType } from '../lib/web3-utils'

const SENTRY_DSN = env('SENTRY_DNS')

class GlobalErrorHandler extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = { error: null, errorStack: null }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorStack: errorInfo.componentStack
        .replace(/^\n+|\n+$/g, '')
        .replace(/^ {4}/gm, ''),
    })

    // Once this point is reached, the app can not recover because the routing
    // system, being below this component in the tree, is not functional
    // anymore. To make hash changes work despite this (e.g. by pressing the
    // back button in the browser), the page need to be reloaded.
    window.removeEventListener('hashchange', this.handleHashchange)
    window.addEventListener('hashchange', this.handleHashchange)
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashchange)
  }

  handleReportClick = () => {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: getNetworkType(env('CHAIN_ID')),
    })
    const eventId = Sentry.captureException(this.state.error)
    Sentry.showReportDialog({ eventId })
  }

  handleHashchange = () => {
    window.location.reload()
  }

  render() {
    const { children } = this.props
    const { error, errorStack } = this.state

    return error ? (
      <GlobalErrorScreen>
        {error instanceof DisputeNotFound ? (
          <DisputeNotFoundError disputeId={error.disputeId} />
        ) : (
          <GenericError
            detailsTitle={error.message}
            detailsContent={errorStack}
            reportCallback={SENTRY_DSN ? this.handleReportClick : null}
          />
        )}
      </GlobalErrorScreen>
    ) : (
      children
    )
  }
}

export default GlobalErrorHandler
