import React from 'react'
import { GU } from '@aragon/ui'

export default function SplitAmount({ amount }) {
  const [integer, fractional] = amount.split('.')
  return (
    <span
      css={`
        margin-right: ${0.5 * GU}px;
      `}
    >
      <span>{integer}</span>
      {fractional && <span>.{fractional}</span>}
    </span>
  )
}
