import React from 'react'
import { textStyle, useTheme, IconClose, IconCheck } from '@aragon/ui'

import { Phase as DisputePhase } from '../../types/dispute-status-types'
import {
  juryOutcomeToString,
  appealRulingToString,
  OUTCOMES,
} from '../../utils/crvoting-utils'

function DisputeOutcomeText({ outcome, phase, disputeEnded }) {
  const { Icon, color } = useOutcomeStyle(outcome)

  let outcomeText
  if (disputeEnded || phase === DisputePhase.RevealVote) {
    outcomeText = juryOutcomeToString(outcome)
  } else {
    const confirm = phase === DisputePhase.ConfirmAppeal
    outcomeText = appealRulingToString(outcome, confirm)
  }

  return (
    <div>
      <div
        css={`
          color: ${color};
          display: flex;
          align-items: center;
        `}
      >
        <Icon size="medium" />
        <span
          css={`
            ${textStyle('body2')}
          `}
        >
          {outcomeText}
        </span>
      </div>
    </div>
  )
}

function useOutcomeStyle(outcome) {
  const theme = useTheme()

  if (!outcome || outcome === OUTCOMES.Refused) {
    return {
      Icon: IconClose,
      color: theme.disabledIcon,
    }
  }

  if (outcome === OUTCOMES.Against) {
    return {
      Icon: IconClose,
      color: theme.negative,
    }
  }

  if (outcome === OUTCOMES.InFavor) {
    return {
      Icon: IconCheck,
      color: theme.positive,
    }
  }
}

export default DisputeOutcomeText
