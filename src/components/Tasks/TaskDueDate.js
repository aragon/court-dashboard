import React from 'react'
import { Timer } from '@aragon/ui'
import { dayjs } from '../../utils/date-utils'

function TaskDueDate({ dueDate }) {
  const diff = dayjs(dueDate).diff(dayjs().startOf('day'), 'day')
  return <Timer end={new Date(dueDate)} maxUnits={diff === 0 ? 3 : 2} />
}

export default TaskDueDate
