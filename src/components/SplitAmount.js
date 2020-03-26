import React from 'react'
import { GU, textStyle } from '@aragon/ui'

export default function SplitAmount({ amount }) {
  const [integer, fractional] = amount.split('.')
  return (
    <span
      css={`
        margin-right: ${0.5 * GU}px;
      `}
    >
      <span>{integer}</span>
      {fractional && (
        <span
          css={`
            ${textStyle('title2')}
            font-weight: 300;
          `}
        >
          .{fractional}
        </span>
      )}
    </span>
  )
}
