import React from 'react'

import { GU, textStyle } from '@aragon/ui'

export default function Balance({ symbol, amount, value, iconSrc }) {
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
            color: #637381;
            font-weight: 200;
          `}
        >
          {symbol}
        </span>
      </div>
      <div>
        <span
          css={`
            ${textStyle('title2')}
            font-weight: 200;
          `}
        >
          {amount}
        </span>
      </div>
      <span
        css={`
          ${textStyle('label2')}
          color: #637381;
          font-weight: 200;
        `}
      >{`$ ${value}`}</span>
    </div>
  )
}
