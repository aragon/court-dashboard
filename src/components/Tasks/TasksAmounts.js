import React from 'react'
import { GU } from '@aragon/ui'

const TasksAmounts = ({ amount, status }) => {
  return (
    <div css="display: inline-block">
      <div
        css={`
          width: 40px;
          height: 40px;
          left: 351px;
          top: 211px;

          background: linear-gradient(
            34.19deg,
            #ff8a88 -609.22%,
            #ff918d -73.61%,
            #ffccb6 105.9%
          );
          border-radius: 50%;
        `}
      />
      <div>
        <div
          css={`
            color: #637381;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 25px;
            margin-top: ${GU}px;
          `}
        >
          {status.toUpperCase()}
        </div>
        <div
          css={`
            font-style: normal;
            font-weight: 300;
            font-size: 26px;
          `}
        >
          {amount}
        </div>
      </div>
    </div>
  )
}

export default TasksAmounts
