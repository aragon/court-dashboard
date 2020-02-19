import React from 'react'
import { textStyle, GU } from '@aragon/ui'

function TaskStatus() {
  return (
    <div css="display: flex; align-items:center;">
      <div css="width: 15px; height:15px; border-radius:2px; border: 1.5px solid #F5A623;" />
      <span
        css={`
        ${textStyle('body2')}
        margin-left: ${GU * 0.7}px;
      `}
      >
        Open: Due today
      </span>
    </div>
  )
}

export default TaskStatus
