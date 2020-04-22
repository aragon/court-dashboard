import React, { useCallback, useEffect, useState } from 'react'
import { Button, DropDown, Field, GU, Info, Link } from '@aragon/ui'
import { getDisputeLastRound } from '../../../utils/dispute-utils'
import {
  getAppealRulingOptions,
  appealOptionToString,
} from '../../../utils/crvoting-utils'
import { formatUnits } from '../../../lib/math-utils'
import { Phase as DisputePhase } from '../../../types/dispute-status-types'
import {
  useAppealDeposits,
  useAppealFeeAllowance,
  useFeeBalanceOf,
} from '../../../hooks/useCourtContracts'
import { useWallet } from '../../../providers/Wallet'
import { useCourtConfig } from '../../../providers/CourtConfig'

function AppealPanel({
  confirm,
  dispute,
  onAppeal,
  onApproveFeeDeposit,
  onDone,
}) {
  const { feeToken } = useCourtConfig()
  const { account: connectedAccount } = useWallet()
  const [selectedOutcome, setSelectedOutcome] = useState({
    value: -1,
    error: null,
  })

  // get connected account fee balance and  allowance
  const [feeBalance] = useFeeBalanceOf(connectedAccount)
  const [feeAllowance] = useAppealFeeAllowance(connectedAccount)

  // get required appeal desposits (appeal and confirm appeal)
  const [[appealDeposit, confirmAppealDeposit]] = useAppealDeposits(
    dispute.id,
    dispute.lastRoundId
  )

  // If users have the appeal panel open but the phase has already pass
  // don't let them continue and close it
  useEffect(() => {
    if (
      (confirm && dispute.phase !== DisputePhase.ConfirmAppeal) ||
      (!confirm && dispute.phase !== DisputePhase.AppealRuling)
    ) {
      // close the panel
      onDone()
    }
  }, [confirm, dispute.phase, onDone])

  // Reqiured deposits for appealing and confirming appeal are different
  const requiredDeposit = confirm ? confirmAppealDeposit : appealDeposit

  const { vote, appeal } = getDisputeLastRound(dispute)
  const { winningOutcome } = vote || {}

  // If appealing => options are the opossed of the wining outcome
  // If confirming appeal => options are the opossed of the appealed ruling
  const appealOptions = getAppealRulingOptions(
    confirm ? appeal.appealedRuling : winningOutcome
  )

  const handleOutcomeSelected = useCallback(newOutcome => {
    setSelectedOutcome({ value: newOutcome })
  }, [])

  // For submission
  const handleAppeal = useCallback(
    event => {
      event.preventDefault()

      const errored = validateForm(selectedOutcome.value)
      if (errored) {
        return
      }

      const appealOption = appealOptions[selectedOutcome.value]

      // Appeal ruling
      const disputeId = dispute.id
      const roundId = dispute.lastRoundId
      const appealRuling = appealOption.outcome

      onDone()
      onAppeal(
        disputeId,
        roundId,
        appealRuling,
        requiredDeposit,
        feeAllowance,
        confirm
      )
    },
    [
      appealOptions,
      confirm,
      dispute.id,
      dispute.lastRoundId,
      feeAllowance,
      onAppeal,
      onDone,
      requiredDeposit,
      selectedOutcome.value,
    ]
  )

  // check if connected account has the minimum required deposit to be able to appeal
  const canAppeal = feeBalance.gte(requiredDeposit)

  // Form validation
  const validateForm = outcome => {
    if (outcome === -1) {
      const error = 'You must select an outcome'
      setSelectedOutcome(outcome => ({ ...outcome, error }))
      return true
    }

    return false
  }

  const actionLabel = confirm ? 'Confirm appeal' : 'Appeal ruling'
  const errorMessage = selectedOutcome.error

  return (
    <form onSubmit={handleAppeal}>
      <Field label="Required collateral">
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
      {confirm && appeal && (
        <Field label="Appeal outcome">
          {appealOptionToString(appeal.appealedRuling)}
        </Field>
      )}
      <Field label={confirm ? 'Appeal confirmation outcome' : 'Appeal outcome'}>
        <DropDown
          items={appealOptions.map(option => option.description)}
          placeholder="Select outcome"
          selected={selectedOutcome.value}
          onChange={handleOutcomeSelected}
          wide
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        />
      </Field>
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
        <Info
          mode="warning"
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          You must hold {formatUnits(requiredDeposit)} {feeToken.symbol} in
          order to appeal
        </Info>
      )}
      {errorMessage && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          {errorMessage}
        </Info>
      )}
      <Info>
        Please note that if the final ruling outcome is different from your
        selected appeal, the entire amount of your collateral could be slashed.{' '}
        <Link href="https://help.aragon.org/article/43-dispute-lifecycle#appeal">
          Learn more
        </Link>
        .
      </Info>
    </form>
  )
}

const Panel = React.memo(function Panel({ dispute, confirm, ...props }) {
  const { appeal } = getDisputeLastRound(dispute)

  // Cases where a confirm appeal is done, the next round is created (with no appeal) and the panel hasn't closed yet
  if (confirm && !appeal) {
    return null
  }

  return <AppealPanel dispute={dispute} confirm={confirm} {...props} />
})

export default Panel
