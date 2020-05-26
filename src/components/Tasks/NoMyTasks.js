import React from 'react'
import MessageCard from '../MessageCard'
import noDraftSvg from '../../assets/noDraft.svg'

function NoMyTasks() {
  const title = 'You have no open tasks right now'
  const paragraph = (
    <span>
      You will receive tasks to complete when you are drafted for a dispute
    </span>
  )

  return <MessageCard title={title} paragraph={paragraph} icon={noDraftSvg} />
}

export default NoMyTasks
