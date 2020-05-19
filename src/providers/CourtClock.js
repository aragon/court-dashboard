import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import useNow from '../hooks/useNow'
import { useCourtConfig } from './CourtConfig'
import {
  getTermStartAndEndTime,
  getExpectedCurrentTermId,
} from '../utils/court-utils'

const CourtClockContext = React.createContext()

function CourtClockProvider({ children }) {
  const now = useNow()
  const courtConfig = useCourtConfig()

  const { terms = [], termDuration = 0, currentTerm: actualCurrentTerm } =
    courtConfig || {}

  const expectedCurrentTerm = getExpectedCurrentTermId(now, terms, termDuration)
  const { termStartTime, termEndTime } = getTermStartAndEndTime(
    expectedCurrentTerm,
    terms,
    termDuration
  )

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
