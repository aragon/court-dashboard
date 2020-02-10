import React from 'react'
import { Button, GU, Info, useTheme } from '@aragon/ui'
import { useWallet } from '../../../providers/Wallet'

function DisputeExecuteRuling({ disputeId, onExecuteRuling }) {
  const theme = useTheme()
  const wallet = useWallet()

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const tx = await onExecuteRuling(disputeId)
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        css={`
          display: flex;
          width: 100%;
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        <Button type="submit" mode="strong" wide disabled={!wallet.account}>
          Execute ruling
        </Button>
      </div>
      <Info>
        Anyone can now trigger this action and earn some{' '}
        <span
          css={`
            color: ${theme.help};
          `}
        >
          rewards.
        </span>
      </Info>
    </form>
  )
}

export default DisputeExecuteRuling
