import React from 'react'
import { GU, IconClock, textStyle, Timer, useTheme } from '@aragon/ui'

import { useCourtClock } from '../providers/CourtClock'
import dayjs from 'dayjs'

function ClockModule() {
  const theme = useTheme()
  const { currentTermId, currentTermEndDate, isSynced } = useCourtClock()

  console.log('isSynced', isSynced)
  console.log('currentTermId', currentTermId)
  console.log('currentTermEndDate', currentTermEndDate)
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={`
          background-color: ${theme.background};
          display: flex;
          border-radius: 100px;
          padding: 2px;
          margin-right: ${0.5 * GU}px;
        `}
      >
        <IconClock
          color={isSynced ? theme.blue : theme.negative}
          width={4.5 * GU}
          height={4.5 * GU}
        />
      </div>
      <div
        css={`
          line-height: 1;
          width: 170px;

          & > time {
            & > span:first-child {
              display: none;
            }
            & * {
              line-height: 1.2;
            }
          }
        `}
      >
        <Timer end={dayjs().add(3, 'days')} />
        <span
          css={`
            ${textStyle('body4')};
            color: ${isSynced ? theme.contentSecondary : theme.negative};
            line-height: 1;
          `}
        >
          {isSynced ? 'Court term synced' : 'Term out of sync'}
        </span>
      </div>
    </div>
  )
}

export default ClockModule
