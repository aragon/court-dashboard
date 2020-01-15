import React from 'react'
import { CircleGraph, GU } from '@aragon/ui'

import { useClock } from '../../providers/Clock'
import { useTotalActiveBalancePolling } from '../../hooks/useCourt'

function JurorProbability({ activeBalanceAtCurrentTerm }) {
  const { currentTermId } = useClock()

  const totalActiveBalanceAtCurrentTerm = useTotalActiveBalancePolling(
    currentTermId
  )

  // We must parse amounts to Numbers since BN doesn't support decimals
  const activeBalanceNum = parseInt(activeBalanceAtCurrentTerm, 10)
  const totalActiveBalanceNum = parseInt(totalActiveBalanceAtCurrentTerm, 10)

  const probability =
    totalActiveBalanceNum > 0 ? activeBalanceNum / totalActiveBalanceNum : 0

  console.log('prob', probability)

  return <CircleGraph value={probability} size={6 * GU} />
}

export default JurorProbability
