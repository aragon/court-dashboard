import React, { useCallback } from 'react'
import ANJForm from './ANJForm'
import { parseUnits, formatUnits } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const INVALID_MINIMUM_AMOUNT_ERROR = Symbol('INVALID_MINIMUM_AMOUNT_ERROR')
const AMOUNT_NOT_ZERO_ERORR = Symbol('AMOUNT_NOT_ZERO_ERORR')
const INSUFFICIENT_FUNDS_ERROR = Symbol('INSUFFICIENT_FUNDS_ERROR')

const DeactivateANJ = React.memo(function DeactivateANJ({
  onDeactivateANJ,
  activeBalance,
  onDone,
  panelOpened,
}) {
  const { anjToken, minActiveBalance } = useCourtConfig()
  const maxAmount = activeBalance

  const minActiveBalanceFormatted = formatUnits(minActiveBalance, {
    digits: anjToken.decimals,
  })
  const maxAmountFormatted = formatUnits(maxAmount, {
    digits: anjToken.decimals,
    precision: anjToken.decimals,
  })

  const validation = useCallback(
    amount => {
      const amountBN = parseUnits(amount, anjToken.decimals)
      const activeBalanceAfter = activeBalance.sub(amountBN)

      if (amountBN.gt(maxAmount)) {
        return INSUFFICIENT_FUNDS_ERROR
      }

      if (amountBN.eq(0)) {
        return AMOUNT_NOT_ZERO_ERORR
      }

      if (activeBalanceAfter.lt(minActiveBalance) && activeBalanceAfter.gt(0)) {
        return INVALID_MINIMUM_AMOUNT_ERROR
      }

      return null
    },
    [activeBalance, anjToken.decimals, maxAmount, minActiveBalance]
  )

  const errorToMessage = useCallback(
    error => {
      if (error === INSUFFICIENT_FUNDS_ERROR) {
        return `Insufficient funds, you cannnot deactivate more than ${maxAmountFormatted} ${anjToken.symbol}`
      }

      if (error === AMOUNT_NOT_ZERO_ERORR) {
        return 'Amount must not be zero'
      }

      if (error === INVALID_MINIMUM_AMOUNT_ERROR) {
        return `Your resulting active balance must be 0 or at least the minimum to be a juror (${minActiveBalanceFormatted} ${anjToken.symbol})`
      }

      return ''
    },
    [anjToken.symbol, maxAmountFormatted, minActiveBalanceFormatted]
  )

  return (
    <ANJForm
      actionLabel="Deactivate"
      maxAmount={maxAmount}
      onSubmit={onDeactivateANJ}
      onDone={onDone}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default DeactivateANJ
