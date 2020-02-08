import React from 'react'
import MessageCard from '../MessageCard'

import noDraftSVG from '../../assets/noDraft.svg'

function NoRewards() {
  const title = 'No rewards yet!'
  const paragraph =
    'Once you start arbitrating disputes, your rewards will appear here.'

  return (
    <MessageCard
      title={title}
      paragraph={paragraph}
      icon={noDraftSVG}
      border={false}
      mode="compact"
    />
  )
}

export default NoRewards
