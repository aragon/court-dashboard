import React, { useState } from 'react'
import { Button, DropDown, GU, Info } from '@aragon/ui'

import { getDisputeLastRound } from '../../../utils/dispute-utils'
import { getAppealRulingOptions } from '../../../utils/crvoting-utils'
import { formatUnits } from '../../../lib/math-utils'

import {
  useAppealDeposits,
  useAppealFeeAllowance,
  useFeeBalanceOf,
} from '../../../hooks/useCourtContracts'
import { useCourtConfig } from '../../../providers/CourtConfig'
import { useConnectedAccount } from '../../../providers/Web3'

const AppealPanel = React.memo(function AppealPanel({
  dispute,
  onAppeal,
  onApproveFeeDeposit,
  confirm, // TODO:  appeal confirm
}) {
  const { feeToken } = useCourtConfig()
  const [selectedAppeal, setSelectedAppeal] = useState(-1)
  const connectedAccount = useConnectedAccount()

  const feeBalance = useFeeBalanceOf(connectedAccount)
  const feeAllowance = useAppealFeeAllowance(connectedAccount)
  const [appealDeposit] = useAppealDeposits(dispute.id, dispute.lastRoundId)
  const canAppeal = feeBalance.gte(appealDeposit)

  const lastRound = getDisputeLastRound(dispute)
  const appealOptions = getAppealRulingOptions(lastRound.vote.winningOutcome)

  const handleAppeal = async event => {
    try {
      event.preventDefault()

      if (feeAllowance.lt(appealDeposit)) {
        // Approve fee deposit for appealing
        const approveTx = await onApproveFeeDeposit(appealDeposit)
        await approveTx.wait()
      }

      const appealOption = appealOptions[selectedAppeal]

      // Appeal ruling
      const tx = await onAppeal(
        dispute.id,
        dispute.lastRoundId,
        appealOption.outcome
      )
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  return (
    <form onSubmit={handleAppeal}>
      <DropDown
        items={appealOptions.map(option => option.description)}
        selected={selectedAppeal}
        onChange={setSelectedAppeal}
        wide
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      />
      <Button
        type="submit"
        mode="strong"
        wide
        disabled={!canAppeal}
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        Appeal ruling
      </Button>
      {!canAppeal && (
        <Info mode="warning">
          You must hold {formatUnits(appealDeposit)} {feeToken.symbol} in order
          to appeal
        </Info>
      )}
    </form>
  )
})

export default AppealPanel
