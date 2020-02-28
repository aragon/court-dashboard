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
import { useCourtConfig } from '../../../providers/CourtConfig'
import { useWallet } from '../../../providers/Wallet'

const AppealPanel = React.memo(function AppealPanel({
  dispute,
  onApproveFeeDeposit,
  onAppeal,
  confirm,
  onDone,
}) {
  const { feeToken } = useCourtConfig()
  const [selectedOutcome, setSelectedOutcome] = useState({
    value: -1,
    error: null,
  })
  const { account: connectedAccount } = useWallet()

  const handleOutcomeSelected = useCallback(newOutcome => {
    setSelectedOutcome({ value: newOutcome })
  }, [])

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

  // Cases where a confirm appeal is done, the next round is created (with no appeal) and the panel hasn't closed yet
  if (confirm && !appeal) return null

  const { winningOutcome } = vote || {}
  const appealOptions = getAppealRulingOptions(
    confirm ? appeal.appealedRuling : winningOutcome
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

  // For submission
  const handleAppeal = async event => {
    try {
      event.preventDefault()

      const errored = validateForm(selectedOutcome.value)
      if (errored) {
        return
      }

      if (feeAllowance.lt(requiredDeposit)) {
        // TODO: some ERC20s don't let to set a new allowance if the current allowance is positive (handle this cases)
        if (feeAllowance.eq(0)) {
          console.warn('Allowance must be zero')
        }
        // Approve fee deposit for appealing
        const approveTx = await onApproveFeeDeposit(requiredDeposit)
        await approveTx.wait()
      }

      const appealOption = appealOptions[selectedOutcome.value]

      // Appeal ruling
      const tx = await onAppeal(
        dispute.id,
        dispute.lastRoundId,
        appealOption.outcome
      )

      onDone()
      await tx.wait()
    } catch (err) {
      console.log('Error submitting tx: ', err)
    }
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
})

export default AppealPanel
