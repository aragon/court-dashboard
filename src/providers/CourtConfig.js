import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import environment from '../environment'
import { getNetworkName } from '../lib/web3-utils'
import { networks } from '../networks'
import { useCourtSubscription } from '../hooks/subscription-hooks'
import { bigNum } from '../lib/math-utils'

const CHAIN_ID = environment('CHAIN_ID')
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = networks[getNetworkName(CHAIN_ID)].court

  const courtConfig = useCourtSubscription(courtAddress.toLowerCase())

  const convertedCourtConfig = courtConfig
    ? {
        ...courtConfig,
        minActiveBalance: bigNum(courtConfig.minActiveBalance),
        termDuration: parseInt(courtConfig.termDuration) * 1000,
        evidenceTerms: parseInt(courtConfig.evidenceTerms),
        commitTerms: parseInt(courtConfig.commitTerms),
        revealTerms: parseInt(courtConfig.revealTerms),
        appealTerms: parseInt(courtConfig.appealTerms),
        appealConfirmationTerms: parseInt(courtConfig.appealConfirmationTerms),
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
