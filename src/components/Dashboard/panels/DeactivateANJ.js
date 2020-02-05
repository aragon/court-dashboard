import React, { useCallback } from 'react'
import ANJForm from './ANJForm'
import { formatUnits } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

const DeactivateANJ = React.memo(function DeactivateANJ({
  onDeactivateANJ,
  activeBalance,
  onDone,
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
    amountBN => {
      const activeBalanceAfter = activeBalance.sub(amountBN)

      if (amountBN.gt(maxAmount)) {
        return `Insufficient funds, you cannnot deactivate more than ${maxAmountFormatted} ${anjToken.symbol}`
      }

      if (activeBalanceAfter.lt(minActiveBalance) && activeBalanceAfter.gt(0)) {
        return `Your resulting active balance must be 0 or at least the minimum to be a juror (${minActiveBalanceFormatted} ${anjToken.symbol})`
      }

      return null
    },
    [
      activeBalance,
      anjToken.symbol,
      maxAmount,
      maxAmountFormatted,
      minActiveBalance,
      minActiveBalanceFormatted,
    ]
  )

  return (
    <ANJForm
      actionLabel="Deactivate"
      maxAmount={maxAmount}
      onSubmit={onDeactivateANJ}
      onDone={onDone}
      runParentValidation={validation}
    />
  )
})

export default DeactivateANJ
