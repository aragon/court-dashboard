import React, { useCallback } from 'react'
import { Button, Info, GU, useTheme } from '@aragon/ui'

function DisputeAppeal({ onRequestAppeal, confirm }) {
  const theme = useTheme()

  const actionLabel = confirm ? 'Confirm appeal' : 'Appeal Ruling'

  const handleRequestAppeal = useCallback(() => {
    onRequestAppeal(confirm)
  }, [confirm, onRequestAppeal])

  return (
    <div>
      <Button
        wide
        mode="strong"
        onClick={handleRequestAppeal}
        css={`
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        {actionLabel}
      </Button>
      <Info mode="description">
        Anyone can trigger this action, and whoever does will get some{' '}
        <span
          css={`
            color: ${theme.help};
          `}
        >
          rewards.
        </span>
      </Info>
    </div>
  )
}

export default DisputeAppeal
