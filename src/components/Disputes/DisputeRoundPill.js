import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'

import { numberToWord } from '../../lib/math-utils'

function DisputeRoundPill({ roundId }) {
  const theme = useTheme()

  if (roundId === undefined) return null

  const label = `Round ${numberToWord(roundId)}`
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: linear-gradient(
          14deg,
          ${theme.accentStart.alpha(0.3)} 0,
          ${theme.accentEnd.alpha(0.3)}88%
        );
        border-radius: 100px;
        height: ${2.5 * GU}px;
      `}
    >
      <span
        css={`
          ${textStyle('label2')};
          color: ${theme.accent};
        `}
      >
        {label}
      </span>
    </div>
  )
}

export default DisputeRoundPill
