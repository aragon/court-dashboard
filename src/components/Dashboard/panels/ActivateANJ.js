import React, { useCallback } from 'react'

import { useCourtConfig } from '../../../providers/CourtConfig'
import ANJForm from './ANJForm'
import { formatUnits, parseUnits } from '../../../lib/math-utils'

const INVALID_MINIMUM_AMOUNT_ERROR = Symbol('IVALID_AMOUNT')
const AMOUNT_NOT_ZERO_ERORR = Symbol('AMOUNT_NOT_ZERO_ERORR')
const INSUFFICIENT_FUNDS_ERROR = Symbol('INSUFFICIENT_FUNDS_ERROR')

const ActivateANJ = React.memo(function ActivateANJ({
  onActivateANJ,
  activeBalance,
  walletBalance,
  inactiveBalance,
  fromWallet,
  onDone,
}) {
  const { anjToken, minActiveBalance } = useCourtConfig()
  const maxAmount = fromWallet ? walletBalance : inactiveBalance

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

      if (amountBN.gt(maxAmount)) {
        return INSUFFICIENT_FUNDS_ERROR
      }

      if (amountBN.eq(0)) {
        return AMOUNT_NOT_ZERO_ERORR
      }

      if (activeBalance.add(amountBN).lt(minActiveBalance))
        return INVALID_MINIMUM_AMOUNT_ERROR

      return null
    },
    [activeBalance, anjToken.decimals, maxAmount, minActiveBalance]
  )

  const errorToMessage = useCallback(
    error => {
      if (error === INSUFFICIENT_FUNDS_ERROR) {
        return `Insufficient funds, your ${
          fromWallet
            ? 'wallet balance is'
            : 'inactive balance available for activation is'
        } ${maxAmountFormatted} ${anjToken.symbol} `
      }

      if (error === AMOUNT_NOT_ZERO_ERORR) {
        return 'Amount must not be zero'
      }

      if (error === INVALID_MINIMUM_AMOUNT_ERROR) {
        return `You must have at least ${minActiveBalanceFormatted} ${anjToken.symbol} activated`
      }

      return ''
    },
    [anjToken.symbol, fromWallet, maxAmountFormatted, minActiveBalanceFormatted]
  )

  return (
    <ANJForm
      actionLabel="Activate"
      maxAmount={maxAmount}
      onSubmit={onActivateANJ}
      onDone={onDone}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default ActivateANJ
