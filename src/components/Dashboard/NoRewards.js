import React from 'react'
import { useWallet } from 'use-wallet'

import MessageCard from '../MessageCard'
import { useJurorDraftRewardedQuery } from '../../hooks/query-hooks'
import iconNoRewardsSvg from '../../assets/IconNoRewards.svg'

function NoRewards() {
  const wallet = useWallet()
  const hasJurorClaimedRewards = useJurorDraftRewardedQuery(
    wallet?.account.toLowerCase()
  )

  const title = 'No rewards yet!'
  const paragraph = hasJurorClaimedRewards
    ? 'You have already claimed all your rewards'
    : 'Once you start arbitrating disputes, your rewards will appear here.'

  return (
    <MessageCard
      title={title}
      paragraph={paragraph}
      icon={iconNoRewardsSvg}
      border={false}
      mode="compact"
    />
  )
}

export default NoRewards
