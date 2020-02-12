import React, { useContext } from 'react'
import { useWallet } from '../../providers/Wallet'
import { useCourtConfig } from '../../providers/CourtConfig'
import { useJurorBalancesSubscription } from '../../hooks/subscription-hooks'
import { useANJMovements } from '../../hooks/useANJMovements'

const BalancesContext = React.createContext()

function BalancesProvider({ children }) {
  const wallet = useWallet()
  const { anjToken } = useCourtConfig()

  const { balances, movements } = useJurorBalancesSubscription(
    wallet.account ? wallet.account.toLowerCase() : ''
  )

  // Get latest movement for each balance (wallet, inactive, active)
  const latestMovements = useANJMovements(movements, anjToken.decimals)

  return (
    <BalancesContext.Provider value={{ movements: latestMovements, balances }}>
      {children}
    </BalancesContext.Provider>
  )
}

function useBalances() {
  return useContext(BalancesContext)
}

export { BalancesProvider, useBalances }
