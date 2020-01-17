import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import environment from '../environment'
import { networks } from '../networks'

import { useCourtConfigSubscription } from '../hooks/subscription-hooks'

import { getNetworkName } from '../lib/web3-utils'
import { bigNum } from '../lib/math-utils'

const CHAIN_ID = environment('CHAIN_ID')
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = networks[getNetworkName(CHAIN_ID)].court

  const courtConfig = useCourtConfigSubscription(courtAddress.toLowerCase())

  const convertedCourtConfig = courtConfig
    ? {
        ...courtConfig,
        minActiveBalance: bigNum(courtConfig.minActiveBalance),
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
