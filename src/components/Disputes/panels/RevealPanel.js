import React, { useCallback, useEffect, useState } from 'react'
import { Button, Field, GU, Info, TextInput } from '@aragon/ui'
import { useWallet } from '../../../providers/Wallet'
import { getJurorDraft } from '../../../utils/juror-draft-utils'
import { getDisputeLastRound } from '../../../utils/dispute-utils'
import {
  getCodeFromLocalStorage,
  getOutcomeFromCommitment,
  isValidOutcome,
} from '../../../utils/crvoting-utils'

const RevealPanel = React.memo(function RevealPanel({
  dispute,
  onDone,
  onReveal,
}) {
  const wallet = useWallet()
  const [error, setError] = useState(null)
  const [password, setPassword] = useState('')
  const lastRound = getDisputeLastRound(dispute)

  const jurorDraft = getJurorDraft(lastRound, wallet.account)

  const handlePasswordChange = useCallback(event => {
    setError(null)
    setPassword(event.target.value)
  }, [])

  const validatePassword = useCallback(() => {
    const outcome = getOutcomeFromCommitment(jurorDraft.commitment, password)
    if (!isValidOutcome(outcome)) {
      return { error: 'Invalid one time code' }
    }

    return { outcome }
  }, [jurorDraft.commitment, password])

  const handleReveal = useCallback(
    event => {
      event.preventDefault()

      const { outcome, error } = validatePassword()
      if (error) {
        return setError(error)
      }

      onDone()
      onReveal(
        dispute.id,
        dispute.lastRoundId,
        wallet.account,
        outcome,
        password
      )
    },
    [
      dispute.id,
      dispute.lastRoundId,
      onDone,
      onReveal,
      password,
      validatePassword,
      wallet.account,
    ]
  )

  useEffect(() => {
    const oneTimeCode = getCodeFromLocalStorage(wallet.account, dispute.id)
    if (oneTimeCode) {
      setPassword(oneTimeCode)
    }
  }, [dispute.id, wallet.account])

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
      {error && (
        <Info
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          mode="error"
        >
          {error}
        </Info>
      )}
      <Button type="submit" wide mode="strong">
        Reveal your vote
      </Button>
    </form>
  )
})

export default RevealPanel
