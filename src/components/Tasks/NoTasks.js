import React from 'react'
import noTasks from '../../assets/noTasks.svg'
import MessageCard from '../MessageCard'

function NoTasks() {
  return <MessageCard icon={noTasks} title="No tasks yet!" />
}

export default NoTasks
