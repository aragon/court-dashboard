import React, { useCallback } from 'react'
import { Button, Info, GU } from '@aragon/ui'
import { useWallet } from '../../../providers/Wallet'

function DisputeAppeal({ onRequestAppeal, confirm }) {
  const wallet = useWallet()

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
        disabled={!wallet.account}
      >
        {actionLabel}
      </Button>
      <Info mode="description">
        Anyone holding the required appeal deposit can trigger this action.
      </Info>
    </div>
  )
}

export default DisputeAppeal
