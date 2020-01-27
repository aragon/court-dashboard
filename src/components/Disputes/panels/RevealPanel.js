import React, { useState } from 'react'
import { Button, Field, GU, TextInput } from '@aragon/ui'

import { useConnectedAccount } from '../../../providers/Web3'
import { getDisputeLastRound } from '../../../utils/dispute-utils'
import { getJurorDraft } from '../../../utils/juror-draft-utils'

function RevealPanel({ dispute, onReveal, onDone }) {
  const [password, setPassword] = useState('')
  const connectedAccount = useConnectedAccount()
  const lastRound = getDisputeLastRound(dispute)

  const jurorDraft = getJurorDraft(lastRound, connectedAccount)

  const handlePasswordChange = event => setPassword(event.target.value)

  const handleReveal = async event => {
    event.preventDefault()

    try {
      const tx = await onReveal(
        dispute.id,
        dispute.lastRoundId,
        connectedAccount,
        jurorDraft.commitment,
        password
      )
      await tx.wait()
      onDone()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  return (
    <form onSubmit={handleReveal}>
      <Field label="One time code">
        <TextInput
          value={password}
          css={`
            height: 88px;
          `}
          multiline
          wide
          onChange={handlePasswordChange}
        />
      </Field>
      <Button
        type="submit"
        wide
        mode="strong"
        css={`
          margin-bottom: ${1.5 * GU}px;
        `}
      >
        Reveal your vote
      </Button>
    </form>
  )
}

export default RevealPanel
