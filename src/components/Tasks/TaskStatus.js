import React, { useEffect, useState } from 'react'
import { textStyle, GU } from '@aragon/ui'
import { dayjs } from '../../utils/date-utils'

function getDueDayText(dueDate) {
  const diff = dayjs(dueDate).diff(dayjs().startOf('day'), 'day')

  if (diff === 0) {
    return 'Due today'
  }
  if (diff === 1) {
    return 'Due tomorrow'
  }
  return `Due in ${diff} days`
}

const TaskStatus = React.memo(function TaskStatus({ dueDate }) {
  const [refresh, setRefresh] = useState(false)
  const now = dayjs()

  const startOfNextDay = dayjs()
    .add(1, 'day')
    .startOf('day')

  const refreshTime = startOfNextDay.diff(now) // default milliseconds

  useEffect(() => {
    if (refreshTime <= 0) {
      return
    }
    const timer = setTimeout(() => {
      setRefresh(!refresh)
    }, refreshTime)

    return () => clearTimeout(timer)
  }, [refresh, refreshTime])

  return (
    <div css="display: flex; align-items:center;">
      <div css="width: 15px; height:15px; border-radius:2px; border: 1.5px solid #F5A623;" />
      <span
        css={`
        ${textStyle('body2')}
        margin-left: ${GU * 0.7}px;
      `}
      >
        Open: {getDueDayText(dueDate)}
      </span>
    </div>
  )
})

export default TaskStatus
