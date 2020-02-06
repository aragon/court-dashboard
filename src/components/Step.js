import React from 'react'
import { GU } from '@aragon/ui'

export default function Step({
  stepPoint,
  content,
  active,
  displayPoint,
  ...props
}) {
  if (displayPoint) {
    return (
      <div
        css={`
          background: ${active ? '#FFF6F5' : ''};
        `}
      >
        <div
          css={`
            display: flex;
            margin-left: ${3 * GU}px;
            margin-top: ${active ? 3 * GU : 0}px;
          `}
          {...props}
        >
          <div
            css={`
              position: relative;
              z-index: 1;
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
