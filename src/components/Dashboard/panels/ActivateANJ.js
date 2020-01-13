import React, { useCallback } from 'react'
import BN from 'bn.js'

import { useCourtConfig } from '../../../providers/CourtConfig'
import ANJForm from './ANJForm'
import { fromDecimals, toDecimals } from '../../../lib/math-utils'

const INVALID_AMOUNT_ERROR = Symbol('IVALID_AMOUNT')

const ActivateANJ = React.memo(function ActivateANJ({
  onActivateANJ,
  activeBalance,
  walletBalance,
  onDone,
  panelOpened,
}) {
  const { anjToken, minActiveBalance } = useCourtConfig()

  const minActiveBalanceFormatted = fromDecimals(
    minActiveBalance,
    anjToken.decimals
  )

  const activeBalanceBN = new BN(activeBalance)
  const minActiveBalanceBN = new BN(minActiveBalance)

  const validation = useCallback(
    amount => {
      const amountBN = new BN(toDecimals(amount, anjToken.decimals))

      if (activeBalanceBN.add(amountBN).lt(minActiveBalanceBN))
        return INVALID_AMOUNT_ERROR

      return null
    },
    [activeBalanceBN, anjToken.decimals, minActiveBalanceBN]
  )

  const errorToMessage = error => {
    if (error === INVALID_AMOUNT_ERROR) {
      return `You must have at least ${minActiveBalanceFormatted} activated`
    }

    // TODO: Do validations for max amount depending of wallet balance or inactive Balance

    return ''
  }

  return (
    <ANJForm
      actionLabel="Activate"
      onSubmit={onActivateANJ}
      onDone={onDone}
      panelOpened={panelOpened}
      validateForm={validation}
      errorToMessage={errorToMessage}
    />
  )
})

export default ActivateANJ
