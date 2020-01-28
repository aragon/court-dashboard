import React, { useContext } from 'react'
import { useDisputesSubscription } from '../../hooks/subscription-hooks'

const DisputesContext = React.createContext()

function DisputesStateProvider({ children }) {
  // const connectedAccount = useConnectedAccount()

  const Provider = DisputesContext.Provider

  const { disputes } = useDisputesSubscription()

  return <Provider value={{ disputes }}>{children}</Provider>
}

function useDisputesState() {
  return useContext(DisputesContext)
}

export { DisputesStateProvider, useDisputesState }
