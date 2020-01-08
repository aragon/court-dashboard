import React, { useContext } from 'react'
import useCourtSubscription from './hooks/useCourtSubscription'

const CourtSettingsContext = React.createContext({
  currentTerm: 0,
  termDuration: 0,
  terms: 0,
  evidenceTerms: 0,
  commitTerms: 0,
  revealTerms: 0,
  appealTerms: 0,
  appealConfirmationTerms: 0,
})

export const useCourtSettings = () => useContext(CourtSettingsContext)

export function CourtsettingsProvider({ children }) {
  const court = useCourtSubscription()
  const {
    currentTerm,
    termDuration,
    terms,
    evidenceTerms,
    commitTerms,
    revealTerms,
    appealTerms,
    appealConfirmationTerms,
  } = court
  return (
    <CourtSettingsContext.Provider
      value={{
        currentTerm,
        termDuration: parseInt(termDuration),
        terms,
        evidenceTerms: parseInt(evidenceTerms),
        commitTerms: parseInt(commitTerms),
        revealTerms: parseInt(revealTerms),
        appealTerms: parseInt(appealTerms),
        appealConfirmationTerms: parseInt(appealConfirmationTerms),
      }}
    >
      {children}
    </CourtSettingsContext.Provider>
  )
}
