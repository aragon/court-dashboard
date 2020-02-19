import React from 'react'
import { Button, GU, Info } from '@aragon/ui'

function DisputeReveal({ onRequestReveal }) {
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
      <Info>
        You will be asked a one-time-use code before you can reveal your vote.
      </Info>
    </div>
  )
}
export default DisputeReveal
