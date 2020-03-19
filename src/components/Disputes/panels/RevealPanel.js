import React, { useCallback, useEffect, useState } from 'react'
import { Button, Field, GU, TextInput } from '@aragon/ui'
import { useWallet } from '../../../providers/Wallet'
import { getDisputeLastRound } from '../../../utils/dispute-utils'
import { getJurorDraft } from '../../../utils/juror-draft-utils'
import {
  getCodeFromLocalStorage,
  removeCodeFromLocalStorage,
} from '../../../utils/one-time-code-utils'

const RevealPanel = React.memo(function RevealPanel({
  dispute,
  onReveal,
  onDone,
}) {
  const wallet = useWallet()
  const [password, setPassword] = useState('')
  const lastRound = getDisputeLastRound(dispute)

  const jurorDraft = getJurorDraft(lastRound, wallet.account)

  useEffect(() => {
    const oneTimeCode = getCodeFromLocalStorage(wallet.account, dispute.id)
    if (oneTimeCode) {
      setPassword(oneTimeCode)
    }
  }, [dispute.id, wallet.account])

  const handlePasswordChange = event => setPassword(event.target.value)

  const handleReveal = useCallback(
    async event => {
      event.preventDefault()

      try {
        const tx = await onReveal(
          dispute.id,
          dispute.lastRoundId,
          wallet.account,
          jurorDraft.commitment,
          password
        )

        onDone()
        await tx.wait()
        removeCodeFromLocalStorage(wallet.account, dispute.id)
      } catch (err) {
        console.error('Error submitting tx: ', err)
      }
    },
    [
      dispute.id,
      dispute.lastRoundId,
      jurorDraft.commitment,
      onDone,
      onReveal,
      password,
      wallet.account,
    ]
  )

  return (
    <form onSubmit={handleReveal}>
      <Field label="One-time-use code">
        <TextInput
          value={password}
          css={`
            height: ${11 * GU}px;
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
})

export default RevealPanel
