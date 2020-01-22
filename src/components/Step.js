import React from 'react'
import { GU, useTheme } from '@aragon/ui'

export default function Step({
  stepPoint,
  content,
  active,
  displayPoint,
  ...props
}) {
  const theme = useTheme()
  if (displayPoint) {
    return (
      <div
        css={`
          background: ${active ? theme.accent.alpha(0.1) : ''};
        `}
      >
        <div
          css={`
            display: flex;
            width: 100%;
            padding: 0 ${2 * GU}px;
          `}
          {...props}
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
      </div>
    )
  } else {
    return <div>{content}</div>
  }
}
