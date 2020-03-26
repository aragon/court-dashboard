import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import environment from '../environment'
import { useCourtConfigSubscription } from '../hooks/subscription-hooks'
import { getNetworkType } from '../lib/web3-utils'
import { networks } from '../networks'

const CHAIN_ID = environment('CHAIN_ID')
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = networks[getNetworkType(CHAIN_ID)].court
  const courtConfig = useCourtConfigSubscription(courtAddress)

  return (
    <CourtConfigContext.Provider value={courtConfig}>
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
