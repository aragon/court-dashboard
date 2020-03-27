import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useCourtConfigSubscription } from '../hooks/subscription-hooks'

import { getNetwork } from '../networks'

const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = getNetwork().court
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
