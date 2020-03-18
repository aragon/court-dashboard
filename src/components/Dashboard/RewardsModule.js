import React, { useMemo } from 'react'
import {
  Box,
  Button,
  GU,
  Help,
  Info,
  Link,
  textStyle,
  useTheme,
} from '@aragon/ui'
import Loading from './Loading'
import NoRewards from './NoRewards'

import { useWallet } from '../../providers/Wallet'
import { useCourtConfig } from '../../providers/CourtConfig'
import { getProviderFromUseWalletId } from '../../ethereum-providers'
import useJurorSubscriptionFees from '../../hooks/useJurorSubscriptionFees'

import { bigNum, formatTokenAmount } from '../../lib/math-utils'
import { addressesEqual } from '../../lib/web3-utils'

const useTotalFeeRewards = (arbitrableFees, appealFees, subscriptionFees) => {
  return useMemo(() => {
    const totalArbitrableFees = arbitrableFees
      ? arbitrableFees.reduce((acc, fee) => acc.add(fee.amount), bigNum(0))
      : bigNum(0)

    const totalAppealFees = appealFees
      ? appealFees.reduce((acc, fee) => acc.add(fee.amount), bigNum(0))
      : bigNum(0)

    const totalSubscriptionFees = subscriptionFees
      ? subscriptionFees.reduce((acc, fee) => acc.add(fee.amount), bigNum(0))
      : bigNum(0)

    return { totalArbitrableFees, totalAppealFees, totalSubscriptionFees }
  }, [appealFees, arbitrableFees, subscriptionFees])
}

// anjRewards => ANJ => First settle with `onSettleReward()`, then withdraw
// feeRewards => DAI =>  First settle with `onSettleReward()` or `onSettleAppealDeposit()`, then withdraw
// subscriptions fees => DAI => Can be withdrawn directly from the CourtSubscription contract
// Only after the rewards are settled can a juror withdraw them from the treasury (`onWithdraw()`)
// As opposed to fee rewards, subscription fees are directly withdrawn to the juror's wallet when claimed
const RewardsModule = React.memo(function RewardsModule({
  rewards,
  treasury,
  loading,
  onClaimSubscriptionFees,
  onSettleAppealDeposit,
  onSettleReward,
  onWithdraw,
}) {
  const wallet = useWallet()
  const { feeToken } = useCourtConfig()

  // Subscriptions are fetched directly from the subscriptions contract
  const [subscriptionFees, setSubscriptionFees] = useJurorSubscriptionFees()
  const { anjRewards, feeRewards } = rewards || {}

  const {
    totalArbitrableFees,
    totalAppealFees,
    totalSubscriptionFees,
  } = useTotalFeeRewards(
    feeRewards?.arbitrableFees,
    feeRewards?.appealFees,
    subscriptionFees
  )

  // We'll get the total juror's balance held in the treasury
  // TODO: Handle possible multiple tokens (fee token can change)
  const treasuryToken = treasury?.find(({ token }) =>
    addressesEqual(token.id, feeToken.id)
  )
  const treasuryBalance = treasuryToken ? treasuryToken.balance : bigNum(0)

  // Total dispute fees include appeal fees and arbitrable fees (fees paid by the creator of the dispute for the first round
  // and fees paid by appealers for subsequent rounds)
  const totalDisputesFees = totalArbitrableFees.add(totalAppealFees)

  // All dispute fees are sent to the treasury after being settled
  const totalTreasuryFees = totalDisputesFees.add(treasuryBalance)
  const totalFeeRewards = totalTreasuryFees.add(totalSubscriptionFees)

  // Form submission
  const handleFormSubmit = async event => {
    event.preventDefault()

    if (!rewards) return

    const rewardTransactionQueue = []
    try {
      // Claim all arbitrable fee rewards
      for (const arbitrableFee of feeRewards.arbitrableFees) {
        const { disputeId, rounds } = arbitrableFee
        for (const roundId of rounds) {
          rewardTransactionQueue.push(
            await onSettleReward(disputeId, roundId, wallet.account)
          )
        }
      }

      // Claim all appeal fee rewards
      for (const appealFee of feeRewards.appealFees) {
        const { disputeId, rounds } = appealFee
        for (const roundId of rounds) {
          rewardTransactionQueue.push(
            await onSettleAppealDeposit(disputeId, roundId)
          )
        }
      }

      // Withdraw funds from treasury
      if (totalTreasuryFees.gt(0)) {
        rewardTransactionQueue.push(
          await onWithdraw(feeToken.id, wallet.account, totalTreasuryFees)
        )
      }

      // Claim subscription fees
      for (const subscriptionFee of subscriptionFees) {
        rewardTransactionQueue.push(
          await onClaimSubscriptionFees(subscriptionFee.periodId)
        )
      }

      await Promise.all(rewardTransactionQueue.map(tx => tx.wait()))

      setSubscriptionFees([])
    } catch (err) {
      console.log(`Error claiming rewards: ${err}`)
    }
  }

  const hasRewardsToClaim = anjRewards?.gt(0) || totalFeeRewards.gt(0)
  const showHeading = !loading && hasRewardsToClaim

  return (
    <Box
      heading={showHeading && 'Rewards'}
      padding={hasRewardsToClaim ? 0 : 3 * GU}
    >
      {(() => {
        if (loading) {
          return <Loading height={150} />
        }

        if (!hasRewardsToClaim) {
          return <NoRewards />
        }

        return (
          <div>
            {rewards && anjRewards.gt(0) && <ANJRewards amount={anjRewards} />}
            {totalFeeRewards.gt(0) && (
              <form onSubmit={handleFormSubmit}>
                {totalDisputesFees.gt(0) && (
                  <DisputesFeeRewards
                    totalAppealFees={totalAppealFees}
                    totalArbitrableFees={totalArbitrableFees}
                    distribution={feeRewards.distribution}
                  />
                )}
                {totalSubscriptionFees.gt(0) && (
                  <SubscriptionFeeRewards totalFees={totalSubscriptionFees} />
                )}
                <TotalFees
                  totalFees={totalFeeRewards}
                  requiresMultipleTxs={
                    totalDisputesFees.gt(0) ||
                    (subscriptionFees.length > 0 && treasuryBalance.gt(0))
                  }
                />
              </form>
            )}
          </div>
        )
      })()}
    </Box>
  )
})

const ANJRewards = ({ amount }) => {
  const { anjToken } = useCourtConfig()

  const formattedAmount = formatTokenAmount(
    amount,
    true,
    anjToken.decimals,
    true
  )

  return (
    <FeeSection>
      <RowFee
        label="Ruling fees"
        amount={formattedAmount}
        symbol={anjToken.symbol}
        showPositive
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      />
      <Info>This amount will be sent to your inactive wallet</Info>
    </FeeSection>
  )
}

const DisputesFeeRewards = ({
  distribution,
  totalAppealFees,
  totalArbitrableFees,
}) => {
  const theme = useTheme()
  const { feeToken } = useCourtConfig()
  const { symbol, decimals } = feeToken

  // Format total amounts
  const totalArbitrableFormatted = formatTokenAmount(
    totalArbitrableFees,
    true,
    decimals,
    true
  )
  const totalAppealFormatted = formatTokenAmount(
    totalAppealFees,
    true,
    decimals,
    true
  )

  return (
    <FeeSection>
      {totalArbitrableFees.gt(0) && (
        <RowFee
          label="Dispute fees"
          amount={totalArbitrableFormatted}
          symbol={symbol}
          showPositive
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        />
      )}
      {totalAppealFees.gt(0) && (
        <RowFee
          label="Appeal fees"
          amount={totalAppealFormatted}
          symbol={symbol}
          showPositive
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        />
      )}
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <span
          css={`
            color: ${theme.help};
            margin-right: ${1 * GU}px;
          `}
        >
          Distribution
        </span>
        <Help
          hint="Rewards per dispute"
          css={`
            padding: 0;
          `}
        >
          <DisputesFeeDistribution
            symbol={symbol}
            decimals={decimals}
            distribution={distribution}
          />
        </Help>
      </div>
    </FeeSection>
  )
}

function SubscriptionFeeRewards({ totalFees }) {
  const { feeToken } = useCourtConfig()
  const formattedAmount = formatTokenAmount(
    totalFees,
    true,
    feeToken.decimals,
    true
  )

  return (
    <FeeSection>
      <RowFee
        label="Subscriptions"
        amount={formattedAmount}
        symbol={feeToken.symbol}
        showPositive
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      />
    </FeeSection>
  )
}

function TotalFees({ totalFees, requiresMultipleTxs }) {
  const theme = useTheme()
  const { activated } = useWallet()
  const { feeToken } = useCourtConfig()
  const provider = getProviderFromUseWalletId(activated)

  const { symbol, decimals } = feeToken
  const totalFeesFormatted = formatTokenAmount(totalFees, true, decimals, true)

  return (
    <FeeSection>
      <div>
        <h3
          css={`
            ${textStyle('label1')};
            color: ${theme.surfaceContentSecondary};
            margin-bottom: ${1 * GU}px;
          `}
        >
          Total
        </h3>
        <RowFee
          label="Total rewards"
          amount={totalFeesFormatted}
          symbol={symbol}
          showPositive
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        />
        <Button mode="positive" type="submit" wide>
          Claim rewards
        </Button>
        {requiresMultipleTxs && (
          <Info
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            This action requires multiple transactions to be signed in{' '}
            {provider.name}. Please confirm them one after another.
          </Info>
        )}
      </div>
    </FeeSection>
  )
}

const DisputesFeeDistribution = ({ distribution, symbol, decimals }) => {
  const theme = useTheme()
  return (
    <div>
      <h3
        css={`
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Rewards distribution per dispute
      </h3>
      {distribution
        .sort((d1, d2) => d1.disputeId - d2.disputeId)
        .map(({ disputeId, amount }) => {
          const formattedAmount = formatTokenAmount(amount, false, decimals)

          return (
            <RowFee
              key={disputeId}
              css={`
                ${textStyle('body2')};
                margin-bottom: ${1 * GU}px;
              `}
              label={
                <Link href={`/disputes/${disputeId}`} external={false}>
                  {`Dispute #${disputeId}`}
                </Link>
              }
              isLabelLink
              amount={formattedAmount}
              symbol={symbol}
              showPositive={false}
            />
          )
        })}
    </div>
  )
}

const RowFee = ({
  label,
  isLabelLink,
  amount,
  symbol,
  showPositive,
  ...props
}) => {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:last-child {
          margin-bottom: 0;
        }
      `}
      {...props}
    >
      {isLabelLink ? label : <span>{label}</span>}

      <span
        css={`
          ${showPositive && `color: ${theme.positive}`};
        `}
      >
        {amount} {symbol}
      </span>
    </div>
  )
}

const FeeSection = ({ children }) => {
  const theme = useTheme()
  return (
    <div
      css={`
        padding: ${3 * GU}px;

        & :not(:last-child) {
          border-bottom: 1px solid ${theme.border};
        }
      `}
    >
      {children}
    </div>
  )
}

export default RewardsModule
