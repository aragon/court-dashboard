import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'

import { numberToWord } from '../../lib/math-utils'

function DisputeRoundPill({ roundId }) {
  const theme = useTheme()

  if (roundId === undefined) return null

  const label = `Round ${numberToWord(roundId)}`
  return (
    <span
      css={`
        padding: 1px ${2 * GU}px;
        border-radius: 100px;
        background: linear-gradient(
          14deg,
          ${theme.accentStart.alpha(0.3)} 0,
          ${theme.accentEnd.alpha(0.3)}88%
        );
        ${textStyle('label2')}
        color: ${theme.accent};
        margin-top: 2px;
      `}
    >
      {label}
    </span>
  )
}

export default DisputeRoundPill
