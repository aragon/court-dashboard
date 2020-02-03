import React, { useCallback } from 'react'

import { useCourtConfig } from '../../../providers/CourtConfig'
import ANJForm from './ANJForm'
import { formatUnits, parseUnits } from '../../../lib/math-utils'

const INVALID_AMOUNT_ERROR = Symbol('IVALID_AMOUNT')

const ActivateANJ = React.memo(function ActivateANJ({
  onActivateANJ,
  activeBalance,
  walletBalance,
  onDone,
}) {
  const { anjToken, minActiveBalance } = useCourtConfig()

  const minActiveBalanceFormatted = formatUnits(minActiveBalance, {
    digits: anjToken.decimals,
  })

  const validation = useCallback(
    amount => {
      const amountBN = parseUnits(amount, anjToken.decimals)

      if (activeBalance.add(amountBN).lt(minActiveBalance))
        return INVALID_AMOUNT_ERROR

      return null
    },
    [activeBalance, anjToken.decimals, minActiveBalance]
  )

  const errorToMessage = useCallback(
    error => {
      if (error === INVALID_AMOUNT_ERROR) {
        return `You must have at least ${minActiveBalanceFormatted} activated`
      }

      // TODO: Do validations for max amount depending of wallet balance or inactive Balance

      return ''
    },
    [minActiveBalanceFormatted]
  )

  return (
    <ANJForm
      actionLabel="Activate"
      onSubmit={onActivateANJ}
      onDone={onDone}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default ActivateANJ
