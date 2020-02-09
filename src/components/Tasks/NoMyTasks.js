import React from 'react'
import { useTheme } from '@aragon/ui'
import MessageCard from '../MessageCard'
import noDraftSvg from '../../assets/noDraft.svg'

function NoMyTasks() {
  const theme = useTheme()

  const title = 'You haven’t been drafted to arbitrate a dispute yet'
  const paragraph = (
    <span>
      The more{' '}
      <span
        css={`
          color: ${theme.help};
        `}
      >
        ANJ you activate
      </span>
      , more chances you have to be drafted to arbitrate a dispute.
    </span>
  )

  return <MessageCard title={title} paragraph={paragraph} icon={noDraftSvg} />
}

export default NoMyTasks
