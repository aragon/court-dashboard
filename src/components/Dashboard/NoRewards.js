import React from 'react'
import { useWallet } from 'use-wallet'

import MessageCard from '../MessageCard'
import { useJurorRewardsEverClaimedQuery } from '../../hooks/query-hooks'

import iconNoRewardsSvg from '../../assets/IconNoRewards.svg'

function NoRewards() {
  // This component is only rendered when an account is connected so we are safe to assume that the wallet is not empty
  const wallet = useWallet()
  const hasJurorEverClaimedRewards = useJurorRewardsEverClaimedQuery(
    wallet.account
  )

  const title = 'No rewards yet!'
  const paragraph = hasJurorEverClaimedRewards
    ? 'You have already claimed all your rewards'
    : 'Once you start arbitrating disputes, your rewards will appear here'

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
