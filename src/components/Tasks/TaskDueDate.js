import React from 'react'
import { Timer } from '@aragon/ui'

function TaskDueDate({ dueDate }) {
  return <Timer end={new Date(dueDate)} />
}

export default TaskDueDate
