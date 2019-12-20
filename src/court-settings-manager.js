import React, { useContext } from 'react'
import { useCourtSubscription } from './hooks/useCourtSubscription'

const SettingsContext = React.createContext({
  currentTerm: 0,
})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }) {
  const court = useCourtSubscription()
  const { currentTerm } = court
  return (
    <SettingsContext.Provider value={{ currentTerm }}>
      {children}
    </SettingsContext.Provider>
  )
}
