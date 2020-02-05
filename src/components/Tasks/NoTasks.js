import React from 'react'
import noDataSvg from '../../assets/noData.svg'
import MessageCard from '../MessageCard'

function NoTasks() {
  return <MessageCard title="No tasks yet!" icon={noDataSvg} />
}

export default NoTasks
