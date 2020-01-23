import React from 'react'
import { Button, GU, Info } from '@aragon/ui'
import { useConnectedAccount } from '../../../providers/Web3'

function DisputeReveal({ disputeId, roundId, commitment, onReveal }) {
  const connectedAccount = useConnectedAccount()

  const handleReveal = async () => {
    try {
      const tx = await onReveal(
        disputeId,
        roundId,
        connectedAccount,
        commitment
      ) // TODO: Add password
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
        onClick={handleReveal}
        css={`
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        Reveal your vote
      </Button>
      <Info mode="description">
        You will be asked a password before you can reveal your vote.
      </Info>
    </div>
  )
}
export default DisputeReveal
