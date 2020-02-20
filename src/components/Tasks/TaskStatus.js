import React from 'react'
import { textStyle, GU } from '@aragon/ui'
import dayjs from 'dayjs'
import { datesDiff } from '../../utils/date-utils'

function getEndDay(dueDate) {
  const diff = datesDiff(dayjs(), dayjs(dueDate))

  if (diff === 0) {
    return ' Due Today'
  }
  if (diff === 1) {
    return 'In the next day'
  }
  return `In ${diff} days`
}

const TaskStatus = React.memo(function TaskStatus({ dueDate }) {
  return (
    <div css="display: flex; align-items:center;">
      <div css="width: 15px; height:15px; border-radius:2px; border: 1.5px solid #F5A623;" />
      <span
        css={`
        ${textStyle('body2')}
        margin-left: ${GU * 0.7}px;
      `}
      >
        {`Open: ${getEndDay(dueDate)}`}
      </span>
    </div>
  )
})

export default TaskStatus
