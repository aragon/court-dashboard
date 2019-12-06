import React from 'react'

import { GU, textStyle, useTheme } from '@aragon/ui'

export default function Balance({ symbol, amount, value, iconSrc }) {
  const theme = useTheme()

  return (
    <div
      css={`
        margin-bottom: ${1.5 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <img
          css={`
            margin-right: 8px;
          `}
          alt={symbol}
          src={iconSrc}
        />
        <span
          css={`
            ${textStyle('label1')}
            color: ${theme.contentSecondary};
          `}
        >
          {symbol}
        </span>
      </div>
      <div>
        <span
          css={`
            ${textStyle('title2')}
          `}
        >
          {amount}
        </span>
      </div>
      <span
        css={`
          ${textStyle('label2')}
          color: ${theme.contentSecondary};
        `}
      >{`$ ${value}`}</span>
    </div>
  )
}
