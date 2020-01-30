import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import useNow from '../hooks/useNow'
import { useCourtConfig } from './CourtConfig'
import { getCurrentTermId, getTermStartAndEndTime } from '../utils/court-utils'

const CourtClockContext = React.createContext()

function CourtClockProvider({ children }) {
  const now = useNow()
  const courtConfig = useCourtConfig()

  const { terms = [], termDuration = 0 } = courtConfig || {}

  const currentTermId = getCurrentTermId(now, terms, termDuration)
  const { termStartTime, termEndTime } = getTermStartAndEndTime(
    currentTermId,
    terms,
    termDuration
  )

  const courtClock = useMemo(
    () => ({
      currentTermId,
      currentTermStartDate: new Date(termStartTime * 1000),
      currentTermEndDate: new Date(termEndTime * 1000),
    }),
    [currentTermId, termEndTime, termStartTime]
  )

  return (
    <CourtClockContext.Provider value={courtClock}>
      {children}
    </CourtClockContext.Provider>
  )
}

CourtClockProvider.propTypes = {
  children: PropTypes.node,
}

function useCourtClock() {
  return useContext(CourtClockContext)
}

export { CourtClockProvider, useCourtClock }
