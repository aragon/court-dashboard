import React, { useContext } from 'react'
import { useConnectedAccount } from '../../providers/Web3'
import { useJurorBalancesSubscription } from '../../hooks/subscription-hooks'

const BalancesContext = React.createContext()

function BalancesProvider({ children }) {
  const connectedAccount = useConnectedAccount()

  const { balances, movements } = useJurorBalancesSubscription(
    connectedAccount ? connectedAccount.toLowerCase() : ''
  )

  return (
    <BalancesContext.Provider value={{ movements, balances }}>
      {children}
    </BalancesContext.Provider>
  )
}

function useBalances() {
  return useContext(BalancesContext)
}

export { BalancesProvider, useBalances }
