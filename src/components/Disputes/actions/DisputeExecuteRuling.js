import React, { useCallback } from 'react'
import { Button, GU, Info } from '@aragon/ui'
// import { useWallet } from '../../../providers/Wallet'

// TODO(2020-09-07): we are disallowing disputes related to the AN Cash DAO from being executed for
// now and will re-enable it at a future time
function DisputeExecuteRuling({ disputeId, onExecuteRuling }) {
  // const wallet = useWallet()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      onExecuteRuling(disputeId)
    },
    [disputeId, onExecuteRuling]
  )

  return (
    <form onSubmit={handleSubmit}>
      <div
        css={`
          display: flex;
          width: 100%;
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        <Button type="submit" mode="strong" wide disabled>
          Execute ruling
        </Button>
      </div>
      <Info>
        This action is part of the precedence campaign and will be executed when
        all disputes have finished.
      </Info>
    </form>
  )
}

export default DisputeExecuteRuling
