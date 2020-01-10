import React from 'react'
import { GU } from '@aragon/ui'

export default function Step({ stepPoint, content, active, displayPoint }) {
  // const theme = useTheme()

  if (displayPoint) {
    return (
      <div
        css={`
          background: ${active ? '#FFF6F5' : ''};
          margin-left: ${3 * GU}px;
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 2;
          `}
        >
          {stepPoint}
        </div>

        <div
          css={`
            margin-left: ${1.5 * GU}px;
          `}
        >
          {content}
        </div>
      </div>
    )
  } else {
    return <div>{content}</div>
  }
}
