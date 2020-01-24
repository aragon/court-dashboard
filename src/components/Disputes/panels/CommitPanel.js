import React from 'react'
import { Button } from '@aragon/ui'

function CommitPanel({ dispute, onCommit, commitment }) {
  const handleCommit = async event => {
    try {
      event.preventDefault()

      const tx = await onCommit(dispute.id, dispute.lastRoundId, commitment) // TODO: Add password
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }
  return (
    <form onSubmit={handleCommit}>
      <Button type="submit" mode="strong" wide>
        Commit your vote
      </Button>
    </form>
  )
}

export default CommitPanel
