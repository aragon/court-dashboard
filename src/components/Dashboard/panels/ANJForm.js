import React, { useCallback, useMemo, useState } from 'react'
import { Button, Field, TextInput, useSidePanelFocusOnReady } from '@aragon/ui'

import { parseUnits, formatUnits, bigNum } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const NO_ERROR = Symbol('NO_ERROR')

const MAX_INPUT_DECIMAL_BASE = 3

const ANJForm = React.memo(function ANJForm({
  actionLabel,
  onDone,
  onSubmit,
  validateForm,
  errorToMessage,
}) {
  const [amount, setAmount] = useState({ value: '0', error: NO_ERROR })
  const { anjToken } = useCourtConfig()
  const inputRef = useSidePanelFocusOnReady()

  const minStep = useMemo(
    () =>
      formatUnits(bigNum(1), {
        digits: Math.min(anjToken.decimals, MAX_INPUT_DECIMAL_BASE),
      }),
    [anjToken.decimals]
  )

  // Change amount handler
  const handleAmountChange = useCallback(event => {
    const newAmount = event.target.value
    setAmount(amount => ({ ...amount, value: newAmount }))
  }, [])

  // Form submit
  const handleSubmit = async event => {
    event.preventDefault()

    const error = validateForm(amount.value)
    if (error) {
      setAmount(amount => ({ ...amount, error }))
      return
    }

    try {
      const tx = await onSubmit(parseUnits(amount.value, anjToken.decimals))
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err) // TODO: How should we handle errors ?
    }
    onDone()
  }

  const errorMessage = errorToMessage(amount.error)

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Amount">
        <TextInput
          type="number"
          name="amount"
          wide
          onChange={handleAmountChange}
          value={amount.value}
          step={minStep}
          min="1"
          ref={inputRef}
          required
        />
      </Field>
      <Button label={actionLabel} mode="strong" type="submit" wide />
      {errorMessage && <span>{errorMessage}</span>}
    </form>
  )
})

export default ANJForm
