import React from 'react'
import { useTheme } from '@aragon/ui'

function TasksAmounts({ amount, status }) {
  const theme = useTheme()
  return (
    <div css="display: inline-block">
      <div>
        <div
          css={`
            color: ${theme.surfaceContentSecondary};
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 25px;
          `}
        >
          {status}
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
