import React, { useState } from 'react'
import { Button, DropDown, Field, GU, Info } from '@aragon/ui'

import { getDisputeLastRound } from '../../../utils/dispute-utils'
import {
  getAppealRulingOptions,
  voteToString,
} from '../../../utils/crvoting-utils'
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
  onApproveFeeDeposit,
  onAppeal,
  confirm,
  onDone,
}) {
  const { feeToken } = useCourtConfig()
  const [selectedAppeal, setSelectedAppeal] = useState(-1)
  const connectedAccount = useConnectedAccount()

  // get connected account fee balance and  allowance
  const feeBalance = useFeeBalanceOf(connectedAccount)
  const feeAllowance = useAppealFeeAllowance(connectedAccount)

  // get required appeal desposits (appeal and confirm appeal)
  const [appealDeposit, confirmAppealDeposit] = useAppealDeposits(
    dispute.id,
    dispute.lastRoundId
  )

  // Reqiured deposits for appealing and confirming appeal are different
  const requiredDeposit = confirm ? confirmAppealDeposit : appealDeposit

  // If appealing => options are the opossed of the wining outcome
  // If confirming appeal => options are the opossed of the appealed ruling
  const { vote, appeal } = getDisputeLastRound(dispute)
  const { winningOutcome } = vote || {}
  const appealOptions = getAppealRulingOptions(
    confirm ? appeal.appealedRuling : winningOutcome
  )

  // check if connected account has the minimum required deposit to be able to appeal
  const canAppeal = feeBalance.gte(requiredDeposit)

  const handleAppeal = async event => {
    try {
      event.preventDefault()

      if (feeAllowance.lt(requiredDeposit)) {
        // Approve fee deposit for appealing
        const approveTx = await onApproveFeeDeposit(requiredDeposit)
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
      onDone()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
  }

  const actionLabel = confirm ? 'Confirm appeal' : 'Appealed ruling'

  return (
    <form onSubmit={handleAppeal}>
      <Field label="Required deposit">
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <img
            height="18"
            src={`https://chasing-coins.com/coin/logo/${feeToken.symbol}`}
            css={`
              margin-right: ${0.5 * GU}px;
            `}
          />
          <span>
            {formatUnits(requiredDeposit)} {feeToken.symbol}{' '}
          </span>
        </div>
      </Field>
      {confirm && vote && (
        <Field label="Ruling appealed">
          {voteToString(appeal.appealedRuling)}
        </Field>
      )}
      <DropDown
        items={appealOptions.map(option => option.description)}
        placeholder="Select a ruling"
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
        {actionLabel}
      </Button>
      {!canAppeal && (
        <Info mode="warning">
          You must hold {formatUnits(requiredDeposit)} {feeToken.symbol} in
          order to appeal
        </Info>
      )}
    </form>
  )
})

export default AppealPanel
