import React, { useCallback, useState } from 'react'
import {
  Button,
  Field,
  GU,
  Info,
  TextInput,
  useSidePanelFocusOnReady,
  useTheme,
} from '@aragon/ui'

import { parseUnits, formatUnits } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const NO_ERROR = Symbol('NO_ERROR')

const ANJForm = React.memo(function ANJForm({
  actionLabel,
  maxAmount,
  onDone,
  onSubmit,
  validateForm,
  errorToMessage,
}) {
  const [amount, setAmount] = useState({ value: '0', error: NO_ERROR })
  const { anjToken } = useCourtConfig()
  const theme = useTheme()
  const inputRef = useSidePanelFocusOnReady()

  // Change amount handler
  const handleAmountChange = useCallback(event => {
    const newAmount = event.target.value
    setAmount(amount => ({ ...amount, value: newAmount }))
  }, [])

  const handleOnSelectMaxValue = useCallback(() => {
    setAmount(amount => ({
      ...amount,
      value: formatUnits(maxAmount, {
        digits: anjToken.decimals,
        commas: false,
        precision: anjToken.decimals,
      }),
    }))
  }, [anjToken.decimals, maxAmount])

  // Form submit
  const handleSubmit = async event => {
    event.preventDefault()

    const error = validateForm(amount.value)
    if (error) {
      setAmount(amount => ({ ...amount, error }))
      return
    }

    setAmount(amount => ({ ...amount, error: '' }))

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
      <Field
        css={`
          margin-bottom: ${2 * GU}px;
        `}
        label="Amount"
      >
        <TextInput
          name="amount"
          wide
          onChange={handleAmountChange}
          value={amount.value}
          ref={inputRef}
          required
          adornment={
            <span
              css={`
                margin-right: ${1 * GU}px;
                color: ${theme.accent};
                cursor: pointer;
              `}
              onClick={handleOnSelectMaxValue}
            >
              MAX
            </span>
          }
          adornmentPosition="end"
        />
      </Field>
      {errorMessage && (
        <Info
          css={`
            margin-bottom: ${2 * GU}px;
          `}
          mode="error"
        >
          {errorMessage}
        </Info>
      )}
      <Button
        css={`
          margin-bottom: ${1 * GU}px;
        `}
        label={actionLabel}
        mode="strong"
        type="submit"
        wide
      />
    </form>
  )
})

export default ANJForm
