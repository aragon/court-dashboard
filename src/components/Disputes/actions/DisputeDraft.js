import React from 'react'
import { Button, GU, Info } from '@aragon/ui'

function DisputeDraft({ disputeId, onDraft }) {
  const handleSubmit = async event => {
    event.preventDefault()

    try {
      const tx = await onDraft(disputeId)
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
        <Button type="submit" mode="strong" wide>
          Draft jury
        </Button>
      </div>
      <Info>
        The evidence submission period is closed. Anyone can now trigger the
        drafting of jury and earn some rewards.
      </Info>
    </form>
  )
}

export default DisputeDraft
