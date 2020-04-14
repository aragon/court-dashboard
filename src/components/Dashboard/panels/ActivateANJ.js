import React, { useCallback } from 'react'
import ANJForm from './ANJForm'
import { formatUnits } from '../../../lib/math-utils'
import { useCourtConfig } from '../../../providers/CourtConfig'

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
    amountBN => {
      if (amountBN.gt(maxAmount)) {
        return `Insufficient funds, your ${
          fromWallet
            ? 'wallet balance is'
            : 'inactive balance available for activation is'
        } ${maxAmountFormatted} ${anjToken.symbol} `
      }

      if (activeBalance.add(amountBN).lt(minActiveBalance)) {
        return `You must have at least ${minActiveBalanceFormatted} ${anjToken.symbol} activated`
      }

      return null
    },
    [
      activeBalance,
      anjToken.symbol,
      fromWallet,
      maxAmount,
      maxAmountFormatted,
      minActiveBalance,
      minActiveBalanceFormatted,
    ]
  )

  return (
    <ANJForm
      actionLabel="Activate"
      maxAmount={maxAmount}
      onSubmit={onActivateANJ}
      onDone={onDone}
      runParentValidation={validation}
    />
  )
})

export default ActivateANJ
