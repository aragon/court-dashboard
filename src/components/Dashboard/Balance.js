import React from 'react'
import { Button, GU, Help, textStyle, useTheme } from '@aragon/ui'

import { useSpring, animated } from 'react-spring'

import Loading from './Loading'

import { useCourtConfig } from '../../providers/CourtConfig'
import useBalanceToUsd from '../../hooks/useTokenBalanceToUsd'

import { formatTokenAmount, formatUnits } from '../../lib/math-utils'
import { movementDirection, convertToString } from '../../types/anj-types'

import ANJIcon from '../../assets/IconANJ.svg'
import lockIcon from '../../assets/IconLock.svg'

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
  loading,
}) {
  const theme = useTheme()
  const {
    anjToken: { symbol, decimals },
  } = useCourtConfig()

  const convertedAmount = useBalanceToUsd(symbol, decimals, amount)

  const springProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 300,
  })

  return (
    <div>
      <div
        css={`
          border-bottom: 1px solid ${theme.border.alpha(0.7)};
        `}
      >
        {loading ? (
          <Loading height={86} />
        ) : (
          <animated.div
            style={springProps}
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
                <img height="20" width="18" src={ANJIcon} alt="ANJ" />
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
          </animated.div>
        )}
      </div>
      {loading ? (
        <div
          css={`
            height: 96px;
          `}
        />
      ) : (
        <animated.div style={springProps}>
          <div
            css={`
              margin: ${2 * GU}px 0;
              color: ${theme.contentSecondary};
            `}
          >
            {activity ? (
              <LatestActivity activity={activity} tokenSymbol={symbol} />
            ) : (
              <span>No activity in the last 24h</span>
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
        </animated.div>
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

  let color = theme.contentSecondary
  // If sign shouldn't be displayed it means it's a Locked movement
  if (displaySign) color = isIncoming ? theme.positive : theme.negative

  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {!displaySign && (
          <img
            src={lockIcon}
            alt="lock"
            width="12px"
            height="14px"
            css={`
              margin-right: ${0.5 * GU}px;
            `}
          />
        )}
        <span
          css={`
            color: ${color};
            margin-right: ${0.5 * GU}px;
          `}
        >
          {formatTokenAmount(
            activity.amount,
            isIncoming,
            anjToken.decimals,
            displaySign
          )}{' '}
          {anjToken.symbol}
        </span>
        <span
          css={`
            color: ${theme.content};
          `}
        >
          {convertToString(activity.type, activity.direction)}
        </span>
      </div>
      {!displaySign && (
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <span
            css={`
              color: ${theme.help};
              margin-right: ${0.5 * GU}px;
            `}
          >
            Why{' '}
          </span>
          <Help hint="This is a hint">This is a hint</Help>
        </div>
      )}
    </div>
  )
}

export default Balance
