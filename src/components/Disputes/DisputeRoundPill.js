import React from 'react'
import { GU, textStyle, useTheme } from '@aragon/ui'
import { useCourtConfig } from '../../providers/CourtConfig'

import { numberToWord } from '../../lib/math-utils'

function DisputeRoundPill({ roundId }) {
  const theme = useTheme()
  const { maxRegularAppealRounds } = useCourtConfig()

  if (roundId === undefined) return null

  const isFinal = roundId >= maxRegularAppealRounds

  const label = isFinal ? 'Final round' : `Round ${numberToWord(roundId)}`
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
        width: ${14 * GU}px;
        margin-top: ${0.5 * GU}px;
      `}
    >
      <span
        css={`
          ${textStyle('label2')};
          color: ${theme.accent};
          transform: translateY(1px);
        `}
      >
        {label}
      </span>
    </div>
  )
}

export default DisputeRoundPill
