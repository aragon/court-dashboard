import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import environment from '../environment'
import { useCourtConfigSubscription } from '../hooks/subscription-hooks'
import { getNetworkType } from '../lib/web3-utils'
import { networks } from '../networks'
import { bigNum } from '../lib/math-utils'

const CHAIN_ID = environment('CHAIN_ID')
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = networks[getNetworkType(CHAIN_ID)].court
  const courtConfig = useCourtConfigSubscription(courtAddress)

  const convertedCourtConfig = courtConfig
    ? {
        ...courtConfig, // TODO: Move data conversion to subscription handler
        draftFee: bigNum(courtConfig.draftFee),
        settleFee: bigNum(courtConfig.settleFee),
        jurorFee: bigNum(courtConfig.jurorFee),
        minActiveBalance: bigNum(courtConfig.minActiveBalance),
        maxRegularAppealRounds: parseInt(
          courtConfig.maxRegularAppealRounds,
          10
        ),
        termDuration: parseInt(courtConfig.termDuration, 10) * 1000,
        currentTerm: parseInt(courtConfig.currentTerm, 10),
        evidenceTerms: parseInt(courtConfig.evidenceTerms, 10),
        commitTerms: parseInt(courtConfig.commitTerms, 10),
        revealTerms: parseInt(courtConfig.revealTerms, 10),
        appealTerms: parseInt(courtConfig.appealTerms, 10),
        appealConfirmationTerms: parseInt(
          courtConfig.appealConfirmationTerms,
          10
        ),
        terms: courtConfig.terms.map(term => ({
          ...term,
          startTime: parseInt(term.startTime, 10) * 1000,
        })),
      }
    : null

  return (
    <CourtConfigContext.Provider value={convertedCourtConfig}>
      {children}
    </CourtConfigContext.Provider>
  )
}

CourtConfigProvider.propTypes = {
  children: PropTypes.node,
}

function useCourtConfig() {
  return useContext(CourtConfigContext)
}

export { CourtConfigProvider, useCourtConfig }
