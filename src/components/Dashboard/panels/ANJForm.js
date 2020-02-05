import React, { useCallback, useState } from 'react'
import {
  ButtonBase,
  Button,
  Field,
  GU,
  Info,
  TextInput,
  useSidePanelFocusOnReady,
  useTheme,
} from '@aragon/ui'

import { parseUnits, formatUnits, bigNum } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const ANJForm = React.memo(function ANJForm({
  actionLabel,
  maxAmount,
  onDone,
  onSubmit,
  runParentValidation,
}) {
  const [amount, setAmount] = useState({
    value: '0',
    valueBN: bigNum(0),
    error: null,
  })
  const { anjToken } = useCourtConfig()
  const theme = useTheme()
  const inputRef = useSidePanelFocusOnReady()

  // Change amount handler
  const handleAmountChange = useCallback(
    event => {
      const newAmount = event.target.value
      let newAmountBN

      try {
        newAmountBN = parseUnits(newAmount, anjToken.decimals)
      } catch (err) {
        newAmountBN = bigNum(-1)
      }

      setAmount(amount => ({
        ...amount,
        value: newAmount,
        valueBN: newAmountBN,
      }))
    },
    [anjToken.decimals]
  )

  // Max value selection handler
  const handleOnSelectMaxValue = useCallback(() => {
    setAmount(amount => ({
      ...amount,
      value: formatUnits(maxAmount, {
        digits: anjToken.decimals,
        commas: false,
        precision: anjToken.decimals,
      }),
      valueBN: maxAmount,
    }))
  }, [anjToken.decimals, maxAmount])

  // Form validation
  const validateForm = useCallback(() => {
    if (amount.valueBN.eq(0)) {
      return 'Amount must not be zero'
    }

    if (amount.valueBN.eq(-1)) {
      return 'Wrong amount format'
    }

    return runParentValidation(amount.valueBN)
  }, [amount.valueBN, runParentValidation])

  // Form submit
  const handleSubmit = async event => {
    event.preventDefault()

    const error = validateForm(amount.valueBN)
    if (error) {
      setAmount(amount => ({ ...amount, error }))
      return
    }

    setAmount(amount => ({ ...amount, error: null }))

    try {
      const tx = await onSubmit(amount.valueBN)
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err) // TODO: How should we handle errors ?
    }
    onDone()
  }

  const errorMessage = amount.error

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
            <ButtonBase
              css={`
                margin-right: ${1 * GU}px;
                color: ${theme.accent};
              `}
              onClick={handleOnSelectMaxValue}
            >
              MAX
            </ButtonBase>
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
