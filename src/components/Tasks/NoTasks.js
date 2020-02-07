import React from 'react'
import noData from '../../assets/noData.svg'
import MessageCard from '../MessageCard'

function NoTasks() {
  const title = 'No tasks yet!'
  return <MessageCard icon={noData} title={title} />
}

export default NoTasks
