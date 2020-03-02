import React from 'react'
import { Button, GU, Info } from '@aragon/ui'
import { useWallet } from '../../../providers/Wallet'

function DisputeExecuteRuling({ disputeId, onExecuteRuling }) {
  const wallet = useWallet()

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const tx = await onExecuteRuling(disputeId)
      await tx.wait()
    } catch (err) {
      console.error('Error submitting tx: ', err)
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
        <strong>Anyone</strong> can now trigger this action.
      </Info>
    </form>
  )
}

export default DisputeExecuteRuling
