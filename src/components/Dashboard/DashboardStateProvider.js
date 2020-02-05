import React, { useContext } from 'react'
import { useConnectedAccount } from '../../providers/Web3'
import {
  useJurorBalancesSubscription,
  useAppealsByUserSubscription,
  useJurorRewardsSubscription,
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

  // Juror balances
  const {
    balances,
    movements,
    fetching: balancesFetching,
    errors: balanceErrors,
  } = useJurorBalancesSubscription(account)

  // Appeals
  const {
    appeals,
    fetching: appealsFetching,
    errors: appealErrors,
  } = useAppealsByUserSubscription(account, false) // Non settled appeals

  // Rewards
  const {
    jurorDrafts,
    fetching: jurorDraftsFetching,
    error: jurorDraftsError,
  } = useJurorRewardsSubscription(account)

  const fetching = balancesFetching || appealsFetching || jurorDraftsFetching
  const errors = [...balanceErrors, ...appealErrors, jurorDraftsError]

  return (
    <Provider
      value={{
        appeals,
        balances,
        movements,
        jurorDrafts,
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
