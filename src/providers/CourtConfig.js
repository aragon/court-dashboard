import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useCourtConfigSubscription } from '../hooks/subscription-hooks'
import { getNetworkConfig } from '../networks'

const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = getNetworkConfig().court
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
