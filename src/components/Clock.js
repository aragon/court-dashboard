import React from 'react'
import { Timer } from '@aragon/ui'

import { useClock } from '../providers/Clock'

// Useful component to validate the different transitions
// ONLY FOR DEVELOPMENT
export default function Clock() {
  console.log('tra clock')
  const { currentTermId, currentTermEndTime } = useClock()
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
      <Timer format="ms" end={new Date(currentTermEndTime * 1000)} />
    </div>
  )
}
