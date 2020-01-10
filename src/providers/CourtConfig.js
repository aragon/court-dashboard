import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useSubscription } from 'urql'

import { CourtConfig as CourtConfigSubscription } from '../queries/court'

import environment from '../environment'
import { getNetworkName } from '../lib/web3'
import { networks } from '../networks'

const CHAIN_ID = environment('CHAIN_ID')
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = networks[getNetworkName(CHAIN_ID)].court

  const [result] = useSubscription({
    query: CourtConfigSubscription,
    variables: { id: courtAddress.toLocaleLowerCase() },
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

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
