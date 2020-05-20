import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import useNow from '../hooks/useNow'
import { useCourtConfig } from './CourtConfig'
import { getTermPeriod, getExpectedCurrentTermId } from '../utils/court-utils'

const CourtClockContext = React.createContext()

function CourtClockProvider({ children }) {
  const now = useNow()
  const courtConfig = useCourtConfig()

  const { currentTerm: actualCurrentTerm, terms = [], termDuration = 0 } =
    courtConfig || {}

  const expectedCurrentTerm = getExpectedCurrentTermId(now, {
    terms,
    termDuration,
  })
  const [termStartTime, termEndTime] = getTermPeriod(expectedCurrentTerm, {
    terms,
    termDuration,
  })

  const courtClock = useMemo(
    () => ({
      currentTermId: expectedCurrentTerm,
      currentTermStartDate: new Date(termStartTime),
      currentTermEndDate: new Date(termEndTime),
      isSynced: expectedCurrentTerm === actualCurrentTerm,
      neededTransitions: expectedCurrentTerm - actualCurrentTerm,
    }),
    [actualCurrentTerm, expectedCurrentTerm, termEndTime, termStartTime]
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
