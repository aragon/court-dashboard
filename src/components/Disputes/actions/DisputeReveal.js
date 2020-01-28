import React from 'react'
import { Button, GU, Info } from '@aragon/ui'

function DisputeReveal({ disputeId, roundId, commitment, onRequestReveal }) {
  return (
    <div>
      <Button
        wide
        mode="strong"
        onClick={onRequestReveal}
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
