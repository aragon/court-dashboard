import React from 'react'
import { GU, LoadingRing, textStyle } from '@aragon/ui'

function Loading() {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        width: 150px;
        margin: 0 auto;
        height: 50px;
        padding-bottom: ${1 * GU}px;
      `}
    >
      <LoadingRing />
      <span
        css={`
        ${textStyle('body1')}
          margin-left: ${1 * GU}px;
        `}
      >
        Loading…
      </span>
    </div>
  )
}

export default Loading
