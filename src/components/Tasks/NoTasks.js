import React from 'react'
import noTasks from '../../assets/noTasks.svg'
import MessageCard from '../MessageCard'

function NoTasks() {
  const title = 'No tasks yet!'
  return <MessageCard icon={noTasks} title={title} />
}

export default NoTasks
