import React from 'react'
import { GU, useTheme } from '@aragon/ui'

export default function Step({ primary, secondary, active }) {
  const theme = useTheme()

  return (
    <div
      css={`
        display: flex;
        align-items: flex-start;
        position: relative;
        background: ${active ? theme.surfaceSelected : ''};
        padding: ${1 * GU}px ${3 * GU}px;
        &:first-child {
          padding-top: 0;
        }
        &:last-child {
          padding-bottom: 0;
        }
      `}
    >
      <div
        css={`
          z-index: 2;
          margin-right: 24px;
        `}
      >
        {primary}
      </div>
      <div>{secondary}</div>
    </div>
  )
}
