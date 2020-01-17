import React, { useContext } from 'react'
import { useConnectedAccount } from '../../providers/Web3'
import { useJurorBalancesSubscription } from '../../hooks/subscription-hooks'

const BalancesContext = React.createContext()

function BalancesProvider({ children }) {
  const connectedAccount = useConnectedAccount()

  const Provider = BalancesContext.Provider

  // Workaround to not subscribe when no connected account
  if (connectedAccount)
    return (
      <WithSubscription Provider={Provider} connectedAccount={connectedAccount}>
        {children}
      </WithSubscription>
    )

  return <Provider value={{ balances: {}, movements: [] }}>{children}</Provider>
}

const WithSubscription = ({ Provider, connectedAccount, children }) => {
  const account = connectedAccount.toLowerCase()
  const { balances, movements } = useJurorBalancesSubscription(account)

  return <Provider value={{ balances, movements }}>{children}</Provider>
}

function useBalances() {
  return useContext(BalancesContext)
}

export { BalancesProvider, useBalances }
