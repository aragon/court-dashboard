import React from 'react'
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
import { bigNum, formatTokenAmount } from '../../lib/math-utils'
import { addressesEqual } from '../../lib/web3-utils'

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
  treasury,
  loading,
  onWithdraw,
  onSettleReward,
  onSettleAppealDeposit,
}) {
  const wallet = useWallet()
  const { feeToken } = useCourtConfig()

  const { totalArbitrableFees, totalAppealFees } = useTotalDisputesFees(
    rewards?.arbitrableFees,
    rewards?.appealFees
  )

  // TODO: Handle possible multiple tokens (fee token can change)
  const treasuryToken = treasury?.find(({ token }) =>
    addressesEqual(token.id, feeToken.id)
  )
  const treasuryBalance = treasuryToken ? treasuryToken.balance : bigNum(0)
  const totalDisputesFees = totalArbitrableFees.add(totalAppealFees)
  const totalFees = totalDisputesFees.add(treasuryBalance)

  // Form submission
  const handleFormSubmit = async event => {
    event.preventDefault()

    if (!rewards) return

    const rewardTransactionQueue = []
    try {
      // Claim all arbitrable fee rewards
      for (const arbitrableFee of rewards.arbitrableFees) {
        const { disputeId, rounds } = arbitrableFee
        for (const roundId of rounds) {
          rewardTransactionQueue.push(
            await onSettleReward(disputeId, roundId, wallet.account)
          )
        }
      }

      // Claim all appeal fee rewards
      for (const appealFee of rewards.appealFees) {
        const { disputeId, rounds } = appealFee
        for (const roundId of rounds) {
          rewardTransactionQueue.push(
            await onSettleAppealDeposit(disputeId, roundId)
          )
        }
      }

      // Withdraw funds from treasury
      rewardTransactionQueue.push(
        await onWithdraw(feeToken.id, wallet.account, totalFees)
      )

      await Promise.all(rewardTransactionQueue.map(tx => tx.wait()))
    } catch (err) {
      console.error(`Error claiming rewards: ${err}`)
    }
  }

  const hasRewardsToClaim = rewards?.rulingFees.gt(0) || totalFees.gt(0)

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
        {totalFees.gt(0) && (
          <form onSubmit={handleFormSubmit}>
            {totalDisputesFees.gt(0) && (
              <DisputesFees
                totalAppealFees={totalAppealFees}
                totalArbitrableFees={totalArbitrableFees}
                distribution={rewards.disputesFeesDistribution}
              />
            )}
            <TotalFees
              totalFees={totalFees}
              treasuryBalance={treasuryBalance}
            />
          </form>
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

function TotalFees({ totalFees, treasuryBalance }) {
  const theme = useTheme()
  const { activated } = useWallet()
  const { feeToken } = useCourtConfig()
  const provider = getProviderFromUseWalletId(activated)

  const { symbol, decimals } = feeToken
  const totalFeesFormatted = formatTokenAmount(totalFees, true, decimals, true)

  // We'll show the info section in the case that the account has settlements to do
  const showInfoSection = !totalFees.eq(treasuryBalance)

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
        {showInfoSection && (
          <Info
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            This action requires multiple transactions to be signed in{' '}
            {provider.name}. Potentially, one transaction per round of rewards.
            Please confirm them one after another.
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
