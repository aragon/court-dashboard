import React, { useCallback, useState } from 'react'
import { Button, Field, TextInput } from '@aragon/ui'
import { useCourtConfig } from '../../../providers/CourtConfig'
import { fromDecimals, toDecimals } from '../../../lib/math-utils'

const MAX_INPUT_DECIMAL_BASE = 6

export default function ActivateANJ({ activateANJ }) {
  const { minActiveBalance, anjToken } = useCourtConfig()
  const minActiveBalanceFormatted = fromDecimals(
    minActiveBalance,
    anjToken.decimals
  )

  const [amount, setAmount] = useState(minActiveBalanceFormatted)
  const minStep = fromDecimals(
    '1',
    Math.min(anjToken.decimals, MAX_INPUT_DECIMAL_BASE)
  )

  // Change amount handler
  const handleAmountChange = useCallback(event => {
    setAmount(event.target.value)
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      // if (requiresApproval) {
      //   const approveTx = await approveANJTransfer()
      //   await approveTx.wait()
      // }
      const tx = await activateANJ(toDecimals(amount, anjToken.decimals))
      await tx.wait()
    } catch (err) {
      console.log('Error activating tokens: ', err) // TODO: How should we handle errors ?
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Amount">
        <TextInput
          type="number"
          name="amount"
          wide
          onChange={handleAmountChange}
          value={amount}
          min={minActiveBalanceFormatted}
          step={minStep}
          required
        />
      </Field>
      <Button label="Activate" mode="strong" type="submit" wide />
    </form>
  )
}
