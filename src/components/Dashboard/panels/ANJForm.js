import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Field, TextInput } from '@aragon/ui'
import { fromDecimals, toDecimals } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const NO_ERROR = Symbol('NO_ERROR')

const MAX_INPUT_DECIMAL_BASE = 3

function ANJForm({
  actionLabel,
  onDone,
  onSubmit,
  panelOpened,
  validateForm,
  errorToMessage,
}) {
  const [amount, setAmount] = useState({ value: '0', error: NO_ERROR })
  const { anjToken } = useCourtConfig()
  const inputRef = useRef(null)

  const minStep = fromDecimals(
    '1',
    Math.min(anjToken.decimals, MAX_INPUT_DECIMAL_BASE)
  )

  // Focus input when panel opened
  useEffect(() => {
    if (panelOpened) inputRef.current.focus()
  }, [panelOpened])

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
      const tx = await onSubmit(toDecimals(amount.value, anjToken.decimals))
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
}

export default ANJForm
