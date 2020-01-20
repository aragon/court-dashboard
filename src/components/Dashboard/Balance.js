import React from 'react'
import { Button, GU, textStyle, useTheme } from '@aragon/ui'
import ANJIcon from '../../assets/anj.svg'
import { formatTokenAmount, formatUnits } from '../../lib/math-utils'
import {
  movementDirection,
  convertToString,
} from '../../types/anj-movement-types'
import { useCourtConfig } from '../../providers/CourtConfig'

import useBalanceToUsd from '../../hooks/useTokenBalanceToUsd'

const splitAmount = amount => {
  const [integer, fractional] = amount.split('.')
  return (
    <span
      css={`
        margin-right: 5px;
      `}
    >
      <span className="integer">{integer}</span>
      {fractional && (
        <span
          css={`
            font-size: 16px;
          `}
        >
          .{fractional}
        </span>
      )}
    </span>
  )
}

const Balance = React.memo(function Balance({
  label,
  amount,
  mainIcon,
  mainIconBackground,
  activity,
  actions,
}) {
  const theme = useTheme()
  const {
    anjToken: { symbol, decimals },
  } = useCourtConfig()

  const convertedAmount = useBalanceToUsd(symbol, decimals, amount) // TODO: Change to symbol once price available

  return (
    <div>
      <div
        css={`
          border-bottom: 1px solid ${theme.border.alpha(0.7)};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: flex-start;
            padding-bottom: ${2 * GU}px;
          `}
        >
          <div
            css={`
              padding: ${1.5 * GU}px;
              background: ${mainIconBackground};
              border-radius: 50%;
              margin-right: ${2 * GU}px;
            `}
          >
            <img
              css={`
                display: block;
              `}
              src={mainIcon}
              height={3 * GU}
              width={3 * GU}
            />
          </div>
          <div>
            <span
              css={`      
                ${textStyle('body2')}
                color: ${theme.contentSecondary};
                display:block;
              `}
            >
              {label}
            </span>
            <div
              css={`
                ${textStyle('title3')}
                line-height: 1.2;
                display: flex;
                align-items: center;
              `}
            >
              {splitAmount(formatUnits(amount, { digits: decimals }))}
              <img height="20px" width="18px" src={ANJIcon} />
            </div>
            <span
              css={`
                ${textStyle('body4')}
                color: ${theme.contentSecondary};
                display:block;
              `}
            >
              $ {convertedAmount}
            </span>
          </div>
        </div>
      </div>
      <div
        css={`
          margin: ${2 * GU}px 0;
          color: ${theme.contentSecondary};
        `}
      >
        {activity ? (
          <LatestActivity activity={activity} tokenSymbol={symbol} />
        ) : (
          <span>No recent 24h activity</span>
        )}
      </div>

      {amount.gt(0) && (
        <div
          css={`
            display: grid;
            grid-template-columns: repeat(
              auto-fit,
              minmax(calc(50% - 8px), 1fr)
            );
            grid-column-gap: 8px;
          `}
        >
          {actions.map((action, index) => {
            return (
              <Button
                key={index}
                label={action.label}
                mode={action.mode}
                onClick={action.onClick}
                wide
              />
            )
          })}
        </div>
      )}
    </div>
  )
})

const LatestActivity = ({ activity }) => {
  const theme = useTheme()
  const { anjToken } = useCourtConfig()
  const isIncoming = activity.direction === movementDirection.Incoming
  const displaySign =
    activity.direction === movementDirection.Incoming ||
    activity.direction === movementDirection.Outgoing

  let color
  if (displaySign) color = isIncoming ? theme.positive : theme.negative

  return (
    <span>
      <span
        css={`
          color: ${color};
        `}
      >{`
      ${formatTokenAmount(
        activity.amount,
        isIncoming,
        anjToken.decimals,
        displaySign
      )} ${anjToken.symbol}`}</span>{' '}
      {convertToString(activity.type)}
    </span>
  )
}

export default Balance
