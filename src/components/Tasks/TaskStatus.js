import React from 'react'
import { textStyle, GU } from '@aragon/ui'

function TaskStatus({ status }) {
  return (
    <div css="display: flex; align-items:center;">{getStatusIcon(status)} </div>
  )
}

function getStatusIcon(status) {
  if (status === true) {
    return (
      <>
        <div css="width: 15px; height:15px; border-radius:2px; border: 1.5px solid #F5A623;" />
        <span
          css={`
            ${textStyle('body2')}
            margin-left: ${GU * 0.7}px;
          `}
        >
          Open: Due today
        </span>
      </>
    )
  }
}

export default TaskStatus
