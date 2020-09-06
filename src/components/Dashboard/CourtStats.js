import React from 'react'
import { Box, GU, textStyle, useTheme } from '@aragon/ui'
import Loading from '../Loading'
import SplitAmount from '../SplitAmount'

import { formatUnits } from '../../lib/math-utils'
import {
  useANJAmountToUsd,
  useTokenAmountToUsd,
} from '../../hooks/useTokenAmountToUsd'
import { useCourtConfig } from '../../providers/CourtConfig'
import useCourtStats from '../../hooks/useCourtStats'

function CourtStats() {
  const theme = useTheme()
  const [stats, fetching] = useCourtStats()

  return (
    <Box heading="Court Metrics" padding={3 * GU}>
      {(() => {
        if (fetching) {
          return <Loading height={86} size="large" />
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
                  ${textStyle('body2')};
                  color: ${theme.surfaceContentSecondary};
                  display: block;
                  margin-bottom: ${1 * GU}px;
                `}
              >
                {stat.label}
              </span>
              {stat.token ? (
                <TokenStats stat={stat} theme={theme} />
              ) : (
                <span
                  css={`
                    ${textStyle('title2')};
                    font-weight: 300;
                  `}
                >
                  {!stat.error ? stat.value : '-'}
                </span>
              )}
            </div>
          )
        })
      })()}
    </Box>
  )
}

function TokenStats({ stat, theme }) {
  const { anjToken } = useCourtConfig()

  const { value, token, error } = stat
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
            ${textStyle('title2')};
            font-weight: 300;
          `}
        >
          {!error ? (
            <SplitAmount amount={formatUnits(value, { digits: decimals })} />
          ) : (
            '-'
          )}
        </span>
        {!error && (
          <div
            css={`
              display: inline-flex;
            `}
          >
            <img
              css={`
                margin-right: ${0.5 * GU}px;
              `}
              height="20"
              width="18"
              src={icon}
            />
          </div>
        )}
      </div>
      <span
        css={`
          ${textStyle('body2')};
          color: ${theme.positive};
        `}
      >
        $
        {!error ? (
          symbol === anjToken.symbol ? (
            <ANJUsdValue amount={value} />
          ) : (
            <TokenUsdValue amount={value} decimals={decimals} symbol={symbol} />
          )
        ) : (
          '-'
        )}
      </span>
    </>
  )
}

function ANJUsdValue({ amount }) {
  const usdValue = useANJAmountToUsd(amount)
  return <span>{usdValue}</span>
}

function TokenUsdValue({ amount, decimals, symbol }) {
  const usdValue = useTokenAmountToUsd(symbol, decimals, amount)
  return <span>{usdValue}</span>
}

export default CourtStats
