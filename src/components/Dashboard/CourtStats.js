import React from 'react'
import { Box, GU, textStyle, useTheme } from '@aragon/ui'
import useCourtStats from '../../hooks/useCourtStats'
import { formatUnits } from '../../lib/math-utils'
import {
  useANJBalanceToUsd,
  useTokenBalanceToUsd,
} from '../../hooks/useTokenBalanceToUsd'
import Loading from './Loading'

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

function CourtStats() {
  const theme = useTheme()
  const [stats, fetching] = useCourtStats()

  return (
    <Box heading="Court Metrics" padding={3 * GU}>
      {(() => {
        if (fetching) {
          return <Loading height={86} />
        }
        return stats.map((stat, index) => {
          return (
            <div
              key={index}
              css={`
                margin-bottom: ${2 * GU}px;
                &:last-child {
                  margin-bottom: 0;
                }
              `}
            >
              <span
                css={`      
               ${textStyle('body2')}
               color: ${theme.surfaceContentSecondary};
               display:block;
               margin-bottom:${1 * GU}px;
             `}
              >
                {stat.label}
              </span>
              {stat.token ? (
                <TokenStats stat={stat} theme={theme} />
              ) : (
                <Stat value={stat.value} />
              )}
            </div>
          )
        })
      })()}
    </Box>
  )
}

function Stat({ value }) {
  return (
    <span
      css={`
        ${textStyle('title2')}
        font-weight: 300;
      `}
    >
      {value}
    </span>
  )
}

function TokenStats({ stat, theme }) {
  const { value, token } = stat
  const { decimals, icon, symbol } = token
  return (
    <>
      <div
        css={`
          margin-bottom: ${1 * GU}px;
        `}
      >
        <span
          css={`
            ${textStyle('title2')}
            font-weight: 300;
          `}
        >
          {splitAmount(formatUnits(value, { digits: decimals }))}
        </span>
        <div
          css={`
            display: inline-flex;
          `}
        >
          <img
            css={`
              margin-right: 5px;
            `}
            height="20"
            width="18"
            src={icon}
          />
          <span
            css={` ${textStyle('body2')}
          color: ${theme.surfaceContentSecondary};`}
          >
            {symbol}
          </span>
        </div>
      </div>
      <span
        css={`
          ${textStyle('body2')}
          color: ${theme.positive};
        `}
      >
        ${symbol === 'ANJ' ? AnjUsdValue(value) : TokenUsdValue(token, value)}
      </span>
    </>
  )
}

function AnjUsdValue(amount) {
  const usdValue = useANJBalanceToUsd(amount)
  return usdValue
}

function TokenUsdValue(token, amount) {
  const { decimals, symbol } = token
  const usdValue = useTokenBalanceToUsd(symbol, decimals, amount)
  return usdValue
}

export default CourtStats
