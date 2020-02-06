import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import useNow from '../hooks/useNow'
import { useCourtConfig } from './CourtConfig'
import { getCurrentTermId, getTermStartAndEndTime } from '../utils/court-utils'

const ClockContext = React.createContext()

function ClockProvider({ children }) {
  const now = useNow()
  const courtConfig = useCourtConfig()

  const { terms = [], termDuration = 0 } = courtConfig || {}

  const currentTermId = getCurrentTermId(now, terms, termDuration)
  const { termStartTime, termEndTime } = getTermStartAndEndTime(
    currentTermId,
    terms,
    termDuration
  )

  const clock = useMemo(
    () => ({
      currentTermId,
      currentTermStartDate: new Date(termStartTime),
      currentTermEndDate: new Date(termEndTime),
    }),
    [currentTermId, termEndTime, termStartTime]
  )

  return <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>
}

ClockProvider.propTypes = {
  children: PropTypes.node,
}

function useClock() {
  return useContext(ClockContext)
}

export { ClockProvider, useClock }
