import React from 'react'
import { Timer } from '@aragon/ui'
import { dayjs } from '../../utils/date-utils'

function TaskDueDate({ dueDate }) {
  return <Timer end={dayjs(dueDate)} />
}

export default TaskDueDate
