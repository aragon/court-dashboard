import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useSubscription } from 'urql'
import { CourtConfig as CourtConfigSubscription } from '../queries/courtConfig'

const AragonCourtAddress = '0xC89Ce4735882C9F0f0FE26686c53074E09B0D550' // Eventually this would be taken from aragonPM ?
const CourtConfigContext = React.createContext()

function CourtConfigProvider({ children }) {
  const [result] = useSubscription({
    query: CourtConfigSubscription,
    variables: { id: AragonCourtAddress.toLocaleLowerCase() },
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

  console.log('court config', courtConfig)
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
