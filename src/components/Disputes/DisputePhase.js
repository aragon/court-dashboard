import React from 'react'
import dayjs from '../../lib/dayjs'
import { convertToString } from '../../types/dispute-status-types'

import { GU, textStyle, Timer } from '@aragon/ui'

function DisputePhase({ phase, nextTransition }) {
  const stringPhase = convertToString(phase)
  return (
    <div
      css={`
        flex-direction: column;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div
          css={`
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fef3f1;
            border-radius: 50%;
          `}
        >
          <div
            css={`
              width: 6px;
              height: 6px;
              background: linear-gradient(
                55.75deg,
                #ffc58f 5.83%,
                #ff7c7c 96.88%
              );
              border-radius: 50%;
            `}
          />
        </div>
        <span
          css={`
            color: #ff8a65;
            ${textStyle('body2')}
            weight: 300;
            margin-left: ${GU}px;
          `}
        >
          {stringPhase}
        </span>
      </div>
      <div
        css={`
          margin-left: -${0.5 * GU}px;
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Timer end={dayjs(nextTransition)} />
      </div>
    </div>
  )
}

export default DisputePhase
