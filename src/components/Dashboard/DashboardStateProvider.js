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
    <Provider value={{ balances: {}, movements: [], nonSettledAppeals: [] }}>
      {children}
    </Provider>
  )
}

function WithSubscription({ Provider, connectedAccount, children }) {
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

  // juror drafts not rewarded
  const {
    jurorDrafts,
    fetching: jurorDraftsFetching,
    error: jurorDraftsError,
  } = useJurorDraftsNotRewardedSubscription(account)

  const fetching = balancesFetching || appealsFetching || jurorDraftsFetching
  const errors = [...balanceErrors, ...appealErrors]
  jurorDraftsError && errors.push(jurorDraftsError)

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
