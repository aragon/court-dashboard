import React from 'react'
import {
  Box,
  Button,
  GU,
  Help,
  Info,
  textStyle,
  useTheme,
  Link,
} from '@aragon/ui'
import Loading from './Loading'
import NoRewards from './NoRewards'
import { useCourtConfig } from '../../providers/CourtConfig'
import { useWallet } from '../../providers/Wallet'
import { formatTokenAmount, bigNum } from '../../lib/math-utils'

const useTotalDisputesFees = (arbitrableFees, appealFees) => {
  const totalArbitrableFees = arbitrableFees
    ? arbitrableFees.reduce((acc, fee) => acc.add(fee.amount), bigNum(0))
    : bigNum(0)

  const totalAppealFees = appealFees
    ? appealFees.reduce((acc, fee) => acc.add(fee.amount), bigNum(0))
    : bigNum(0)

  return { totalArbitrableFees, totalAppealFees }
}

// Ruling Fees => ANJ fees
// Dispute fees + Appeal Fees => DAI fees
const RewardsModule = React.memo(function RewardsModule({
  rewards,
  loading,
  onSettleReward,
  onSettleAppealDeposit,
}) {
  const wallet = useWallet()

  // Form submission
  const handleFormSubmit = async event => {
    event.preventDefault()

    if (!rewards) return

    try {
      // Claim all arbitrable fee rewards
      const arbitrableTxs = []
      for (const arbitrableFee of rewards.arbitrableFees) {
        const { disputeId, rounds } = arbitrableFee
        for (const roundId of rounds) {
          arbitrableTxs.push(
            await onSettleReward(disputeId, roundId, wallet.account)
          )
        }
      }

      await Promise.all(arbitrableTxs.map(tx => tx.wait()))

      // Claim all appeal fee rewards
      const appealTxs = []
      for (const appealFee of rewards.appealFees) {
        const { disputeId, rounds } = appealFee
        for (const roundId of rounds) {
          appealTxs.push(await onSettleAppealDeposit(disputeId, roundId))
        }
      }

      await Promise.all(appealTxs.map(tx => tx.wait()))
    } catch (err) {
      console.log(`Error claiming rewards: ${err}`)
    }
  }

  const hasRewardsToClaim =
    rewards &&
    (rewards.rulingFees.gt(0) || rewards.totalDisputesFees.length > 0)

  const showHeading = !loading && hasRewardsToClaim

  return (
    <Box
      heading={showHeading && 'Rewards'}
      padding={hasRewardsToClaim ? 0 : 3 * GU}
    >
      {(() => {
        if (loading) return <Loading height={150} />

        if (!hasRewardsToClaim) return <NoRewards />
        return null
      })()}
      <div>
        {rewards && rewards.rulingFees.gt(0) && (
          <RulingFees amount={rewards.rulingFees} />
        )}
        {rewards && rewards.totalDisputesFees.length > 0 && (
          <DisputesFees
            arbitrables={rewards.arbitrableFees}
            appeals={rewards.appealFees}
            totalDisputesFees={rewards.totalDisputesFees}
            onFormSubmit={handleFormSubmit}
          />
        )}
      </div>
    </Box>
  )
})

const RulingFees = ({ amount }) => {
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

const DisputesFees = ({
  arbitrables,
  appeals,
  totalDisputesFees,
  onFormSubmit,
}) => {
  const theme = useTheme()
  const { feeToken } = useCourtConfig()
  const { symbol, decimals } = feeToken

  const { totalArbitrableFees, totalAppealFees } = useTotalDisputesFees(
    arbitrables,
    appeals
  )

  const totalFees = totalArbitrableFees.add(totalAppealFees)

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
  const totalFeesFormatted = formatTokenAmount(totalFees, true, decimals, true)

  return (
    <form onSubmit={onFormSubmit}>
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
              totalDisputesFees={totalDisputesFees}
              symbol={symbol}
              decimals={decimals}
            />
          </Help>
        </div>
      </FeeSection>
      <FeeSection>
        <div>
          <h3
            css={`
              ${textStyle('label1')}
              color: ${theme.contentSecondary};
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
        </div>
      </FeeSection>
    </form>
  )
}

const DisputesFeeDistribution = ({ totalDisputesFees, symbol, decimals }) => {
  const theme = useTheme()
  return (
    <div>
      <h3
        css={`
          ${textStyle('label2')}
          color: ${theme.contentSecondary};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Rewards distribution per dispute
      </h3>
      {totalDisputesFees
        .sort((d1, d2) => d1.disputeId - d2.disputeId)
        .map(({ disputeId, amount }) => {
          const formattedAmount = formatTokenAmount(amount, false, decimals)

          return (
            <RowFee
              key={disputeId}
              css={`
                ${textStyle('body2')}
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
