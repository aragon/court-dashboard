import React, { useMemo } from 'react'
import { textStyle, useTheme, IconClose, IconCheck } from '@aragon/ui'

import { Phase as DisputePhase } from '../../types/dispute-status-types'
import {
  appealRulingToString,
  finalRulingToString,
  juryOutcomeToString,
  OUTCOMES,
} from '../../utils/crvoting-utils'

function DisputeOutcomeText({
  action,
  isFinalRuling,
  outcome,
  phase,
  verbose = false,
}) {
  const { Icon, color } = useOutcomeStyle(outcome)

  const outcomeText = useMemo(() => {
    if (isFinalRuling) {
      return finalRulingToString(outcome)
    }

    if (
      phase === DisputePhase.AppealRuling ||
      phase === DisputePhase.ConfirmAppeal
    ) {
      const confirm = phase === DisputePhase.ConfirmAppeal
      return appealRulingToString(outcome, confirm)
    }

    return juryOutcomeToString(outcome)
  }, [isFinalRuling, outcome, phase])

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
          {verbose && <span>: {action}</span>}
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
