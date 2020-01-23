import React from 'react'

import { Button, Info, GU, useTheme } from '@aragon/ui'

function DisputeAppeal({
  disputeId,
  roundId,
  onRequestAppeal,
  onRequestConfirmAppeal,
  confirm,
  ruling,
}) {
  const theme = useTheme()

  const actionLabel = confirm ? 'Confirm appeal' : 'Appeal Ruling'

  const handleAppeal = async () => {
    try {
      const action = confirm ? onRequestConfirmAppeal : onRequestAppeal
      const tx = await action(disputeId, roundId, ruling)
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  return (
    <div>
      <Button
        wide
        mode="strong"
        onClick={handleAppeal}
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
