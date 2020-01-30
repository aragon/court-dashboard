import React, { useCallback } from 'react'
import ANJForm from './ANJForm'
import { formatUnits, parseUnits } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const INSUFFICIENT_FUNDS_ERROR = Symbol('INSUFFICIENT_FUNDS_ERROR')

const WithdrawANJ = React.memo(function WithdrawANJ({
  onWithdrawANJ,
  inactiveBalance,
  onDone,
  panelOpened,
}) {
  const { anjToken } = useCourtConfig()

  const maxAmount = inactiveBalance
  const maxAmountFormatted = formatUnits(maxAmount, {
    digits: anjToken.decimals,
    precision: anjToken.decimals,
  })

  const validation = useCallback(
    amount => {
      const amountBN = parseUnits(amount, anjToken.decimals)

      if (amountBN.gt(maxAmount)) {
        return INSUFFICIENT_FUNDS_ERROR
      }
      return null
    },
    [anjToken.decimals, maxAmount]
  )

  const errorToMessage = useCallback(
    error => {
      if (error === INSUFFICIENT_FUNDS_ERROR) {
        return `Insufficient funds, you cannnot withdraw more than ${maxAmountFormatted} ${anjToken.symbol}`
      }
      return ''
    },
    [anjToken.symbol, maxAmountFormatted]
  )

  return (
    <ANJForm
      actionLabel="Withdraw"
      maxAmount={maxAmount}
      onSubmit={onWithdrawANJ}
      onDone={onDone}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default WithdrawANJ
