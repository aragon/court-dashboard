import { useMemo, useEffect, useState } from 'react'
import { useTotalActiveBalance, useTotalANTStaked } from './useCourtContracts'
import { getKnownToken } from '../utils/known-tokens'
import { bigNum } from '../lib/math-utils'

const COURT_STATS = [
  {
    label: 'Total Active ANJ',
    token: getKnownToken('ANJ'),
  },
  {
    label: 'Total Staked ANT',
    token: getKnownToken('ANT'),
  },
  //   { label: 'Total Active Jurors' },
]

function useCourtStats() {
  const [fetching, setFetching] = useState(true)

  const ANJActiveBalance = useTotalActiveBalance()

  const ANTTotalStake = useTotalANTStaked()

  const ANJActiveBalanceKey = ANJActiveBalance.toString()
  const ANTTotalStakeKey = ANTTotalStake.toString()

  useEffect(() => {
    console.log('useEffect')
    if (!ANJActiveBalance.eq(bigNum(-1)) && !ANTTotalStake.eq(bigNum(-1))) {
      setFetching(false)
    }
    console.log('fetching')
  }, [ANJActiveBalanceKey, ANTTotalStakeKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => {
    console.log('return ')
    if (fetching) {
      return [null, true]
    }

    const statsData = [ANJActiveBalance, ANTTotalStake]
    return [
      ...COURT_STATS.map((stat, index) => {
        return {
          ...stat,
          value: statsData[index],
        }
      }),
      false,
    ]
  }, [ANJActiveBalanceKey, ANTTotalStakeKey, fetching]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCourtStats
