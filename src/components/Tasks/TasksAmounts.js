import React from 'react'
import { GU, useTheme } from '@aragon/ui'

function TasksAmounts({ amount, status }) {
  const theme = useTheme()
  return (
    <div css="display: inline-block">
      <div
        css={`
          width: ${5 * GU}px;
          height: ${5 * GU}px;
          background: linear-gradient(
            35deg,
            ${theme.accentStart} -75%,
            ${theme.accentEnd} 105%
          );
          border-radius: 50%;
        `}
      />
      <div>
        <div
          css={`
            color: ${theme.surfaceContentSecondary};
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 25px;
            margin-top: ${1 * GU}px;
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
