import React, { useCallback } from 'react'
import ANJForm from './ANJForm'
import { formatUnits } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const WithdrawANJ = React.memo(function WithdrawANJ({
  onWithdrawANJ,
  inactiveBalance,
  onDone,
}) {
  const { anjToken } = useCourtConfig()

  const maxAmount = inactiveBalance
  const maxAmountFormatted = formatUnits(maxAmount, {
    digits: anjToken.decimals,
    precision: anjToken.decimals,
  })

  const validation = useCallback(
    amountBN => {
      if (amountBN.gt(maxAmount)) {
        return `Insufficient funds, you cannnot withdraw more than ${maxAmountFormatted} ${anjToken.symbol}`
      }

      return null
    },
    [anjToken.symbol, maxAmount, maxAmountFormatted]
  )

  return (
    <ANJForm
      actionLabel="Withdraw"
      maxAmount={maxAmount}
      onSubmit={onWithdrawANJ}
      onDone={onDone}
      runParentValidation={validation}
    />
  )
})

export default WithdrawANJ
