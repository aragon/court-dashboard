import React, { useContext } from 'react'
import { useWallet } from '../../providers/Wallet'
import {
  useJurorBalancesSubscription,
  useAppealsByUserSubscription,
  useJurorDraftsNotRewardedSubscription,
} from '../../hooks/subscription-hooks'

const DashboardContext = React.createContext()

function DashboardStateProvider({ children }) {
  const wallet = useWallet()

  const Provider = DashboardContext.Provider

  // Workaround to not subscribe when no connected account
  if (wallet.account)
    return (
      <WithSubscription Provider={Provider} connectedAccount={wallet.account}>
        {children}
      </WithSubscription>
    )

  return (
    <Provider value={{ balances: {}, anjMovements: [], nonSettledAppeals: [] }}>
      {children}
    </Provider>
  )
}

function WithSubscription({ Provider, connectedAccount, children }) {
  // Juror balances
  const {
    balances,
    anjMovements,
    treasury,
    fetching: balancesFetching,
    errors: balanceErrors,
  } = useJurorBalancesSubscription(connectedAccount)

  // Appeals
  const {
    appeals,
    fetching: appealsFetching,
    errors: appealErrors,
  } = useAppealsByUserSubscription(connectedAccount, false) // Non settled appeals

  // juror drafts not rewarded
  const {
    jurorDrafts,
    fetching: jurorDraftsFetching,
    error: jurorDraftsError,
  } = useJurorDraftsNotRewardedSubscription(connectedAccount)

  const fetching = balancesFetching || appealsFetching || jurorDraftsFetching
  const errors = [
    ...balanceErrors,
    ...appealErrors,
    ...(jurorDraftsError ? [jurorDraftsError] : []),
  ]

  return (
    <Provider
      value={{
        appeals,
        balances,
        errors,
        fetching,
        jurorDrafts,
        anjMovements,
        treasury,
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
