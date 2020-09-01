import React from 'react'
import { GU, Link, textStyle, useTheme } from '@aragon/ui'

import { useCourtConfig } from '../../providers/CourtConfig'
import { formatUnits } from '../../lib/math-utils'

function ANJLockedDistribution({ distribution, text }) {
  const theme = useTheme()
  const {
    anjToken: { decimals, symbol },
  } = useCourtConfig()

  const formattedInProcessAmount = formatUnits(distribution.inProcess, {
    digits: decimals,
  })

  return (
    <div
      css={`
        min-width: ${30 * GU}px;
      `}
    >
      <h3
        css={`
          ${textStyle('label2')}
          color: ${theme.surfaceContentSecondary};
          margin-bottom: ${2 * GU}px;
        `}
      >
        Locked {symbol} Distribution
      </h3>
      {distribution.lockedPerDispute
        .sort((d1, d2) => d1.disputeId - d2.disputeId)
        .map(({ disputeId, amount, weight }) => {
          const formattedAmount = formatUnits(amount.div(weight), {
            digits: decimals,
          })

          return (
            <Row
              key={disputeId}
              label={
                <Link href={`#/disputes/${disputeId}`} external={false}>
                  {`Dispute #${disputeId}`}
                </Link>
              }
              weight={weight}
              amount={formattedAmount}
              symbol={symbol}
              isLabelLink
            />
          )
        })}
      {distribution.inProcess.gt(0) && (
        <Row
          label="In deactivation process"
          amount={formattedInProcessAmount}
          symbol={symbol}
        />
      )}
      <span>{text}</span>
    </div>
  )
}

function Row({ label, isLabelLink, amount, symbol, weight }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: space-between;

        ${textStyle('body2')};

        margin-bottom: ${1 * GU}px;

        &:last-child {
          margin-bottom: 0;
        }
      `}
    >
      {isLabelLink ? (
        label
      ) : (
        <span
          css={`
            color: ${theme.surfaceContentSecondary};
          `}
        >
          {label}
        </span>
      )}

      <span>
        {weight?.gt(1) && `${weight.toNumber()}x `} {amount} {symbol}
      </span>
    </div>
  )
}

export default ANJLockedDistribution
