import React from 'react'
import { GU, useTheme } from '@aragon/ui'

export default function Step({ primary, secondary, active }) {
  const theme = useTheme()

  return (
    <div
      css={`
        background: ${active ? theme.surfaceSelected : ''};
      `}
    >
      <div
        css={`
          position: relative;
          z-index: 2;
        `}
      >
        {primary}
      </div>

      <div
        css={`
          margin-left: ${1.5 * GU}px;
        `}
      >
        {secondary}
      </div>
    </div>
  )
}
