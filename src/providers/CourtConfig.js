import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useSubscription } from 'urql'
<<<<<<< HEAD
import { CourtConfig as CourtConfigSubscription } from '../queries/courtConfig'

const AragonCourtAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550' // Eventually this would be taken from aragonPM ?
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const [result] = useSubscription({
    query: CourtConfigSubscription,
    variables: { id: AragonCourtAddress.toLocaleLowerCase() },
=======
import { CourtConfig as CourtConfigSubscription } from '../queries/court'

import environment from '../environment'
import { getNetworkName } from '../web3-utils'
import { networks } from '../networks'

const CHAIN_ID = environment('CHAIN_ID')
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const courtAddress = networks[getNetworkName(CHAIN_ID)].court

  const [result] = useSubscription({
    query: CourtConfigSubscription,
    variables: { id: courtAddress.toLocaleLowerCase() },
>>>>>>> web3-provider
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

<<<<<<< HEAD
  console.log('court config', courtConfig)
=======
>>>>>>> web3-provider
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
