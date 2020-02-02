import React, { useContext } from 'react'
import { useConnectedAccount } from '../../providers/Web3'
import {
  useJurorBalancesSubscription,
  useAppealsByUserSubscription,
} from '../../hooks/subscription-hooks'

const DashboardContext = React.createContext()

function DashboardStateProvider({ children }) {
  const connectedAccount = useConnectedAccount()

  const Provider = DashboardContext.Provider

  // Workaround to not subscribe when no connected account
  if (connectedAccount)
    return (
      <WithSubscription Provider={Provider} connectedAccount={connectedAccount}>
        {children}
      </WithSubscription>
    )

  return (
    <Provider value={{ balances: {}, movements: [], nonSettledAppeals: [] }}>
      {children}
    </Provider>
  )
}

const WithSubscription = ({ Provider, connectedAccount, children }) => {
  const account = connectedAccount.toLowerCase()
  const {
    balances,
    movements,
    fetching: balancesFetching,
    errors: balanceErrors,
  } = useJurorBalancesSubscription(account)
  const {
    appeals,
    fetching: appealsFetching,
    errors: appealErrors,
  } = useAppealsByUserSubscription(account, false) // Non settled appeals

  const fetching = balancesFetching || appealsFetching
  const errors = [...balanceErrors, ...appealErrors]

  return (
    <Provider
      value={{
        balances,
        movements,
        appealCollaterals: appeals,
        fetching,
        errors,
      }}
    >
      {children}
    </Provider>
  )
}

function useDashboardState() {
  return useContext(DashboardContext)
}

export { DashboardStateProvider, useDashboardState }
