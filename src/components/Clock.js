import React from 'react'
import { Timer } from '@aragon/ui'

import { useCourtClock } from '../providers/CourtClock'

// Useful component to validate the different transitions
// ONLY FOR DEVELOPMENT
export default function Clock() {
  const { currentTermId, currentTermEndDate } = useCourtClock()
  return (
    <div
      css={`
        display: flex;
      `}
    >
      <span
        css={`
          margin-right: 8px;
        `}
      >
        Current term:{' '}
        <span
          css={`
            font-weight: bold;
          `}
        >
          {currentTermId}
        </span>
      </span>
      <span>Ends in </span>
      <Timer format="hms" end={currentTermEndDate} />
    </div>
  )
}
