import React from 'react'
import { GU, ProgressBar, textStyle, useTheme } from '@aragon/ui'
import useNow from '../../hooks/useNow'
import { norm } from '../../lib/math-utils'
import { getRelativeTime, MINUTE } from '../../utils/date-utils'

const TX_DURATION_AVERAGE = 2 * MINUTE
const TX_DURATION_THRESHOLD = TX_DURATION_AVERAGE - MINUTE / 2

function TransactionProgress({ createdAt }) {
  const theme = useTheme()
  const now = useNow().valueOf()

  const estimate = createdAt + TX_DURATION_AVERAGE
  const threshold = createdAt + TX_DURATION_THRESHOLD

  const progress = now > threshold ? -1 : norm(now, createdAt, estimate)

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin-top: ${1 * GU}px;
      `}
    >
      <div
        css={`
          width: ${15 * GU}px;
        `}
      >
        <ProgressBar animate color={theme.info} value={progress} />
      </div>
      <span
        css={`
          ${textStyle('body3')};
          margin-left: ${0.5 * GU}px;
        `}
      >
        {getRelativeTime(now, estimate)}
      </span>
    </div>
  )
}

export default TransactionProgress
