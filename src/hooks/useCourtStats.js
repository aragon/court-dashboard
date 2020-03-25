import { useMemo } from 'react'
import { useTotalANTStakedPolling } from './useCourtContracts'
import { useActiveJurorsNumber } from '../hooks/query-hooks'
import {
  useJurorRegistrySubscription,
  useTotalRewardsSubscription,
} from '../hooks/subscription-hooks'
import { getKnownToken } from '../utils/known-tokens'
import { bigNum } from '../lib/math-utils'
import IconANJ from '../assets/IconANJ.svg'
import IconANT from '../assets/IconANT.svg'
import IconDAI from '../assets/IconDAI.svg'

const COURT_STATS = [
  {
    label: 'Total Active ANJ',
    token: { ...getKnownToken('ANJ'), icon: IconANJ },
  },
  {
    label: 'Total Staked ANT',
    token: { ...getKnownToken('ANT'), icon: IconANT },
  },
  { label: 'Total Active Jurors' },
  {
    label: 'Total Rewards DAI',
    token: { ...getKnownToken('DAI'), icon: IconDAI },
  },
]
export const STAT_NOT_AVAILABLE = bigNum(-2)

export function useTotalActiveBalance() {
  const { data: jurorRegistryStats, error } = useJurorRegistrySubscription()

  return useMemo(() => {
    if (error) {
      return [null, error]
    }
    if (!jurorRegistryStats) {
      return [bigNum(-1), error]
    }
    return [bigNum(jurorRegistryStats?.totalActive) || null, error]
  }, [error, jurorRegistryStats])
}

function useTotalRewards() {
  const { data: rewards, error } = useTotalRewardsSubscription()

  return useMemo(() => {
    if (error) {
      return [null, error]
    }
    if (!rewards) {
      return [bigNum(-1), error]
    }
    return [
      rewards.reduce(
        (totalAcumulator, reward) => totalAcumulator.add(reward.amount),
        bigNum(0)
      ),
      error,
    ]
  }, [error, rewards])
}
/**
 * Hook to get the dashboard stats ANJ active balance, ANT total stake and the active jurors number
 * @returns {Array} First item an array with the stats and the second one a loading state
 */
function useCourtStats() {
  const timeout = 5000
  const [anjActiveBalance, activeBalanceError] = useTotalActiveBalance()
  const antTotalStake = useTotalANTStakedPolling(timeout)
  const activeJurors = useActiveJurorsNumber()
  const [totalRewards, totalRewardsError] = useTotalRewards()
  console.log('totalREwards ', totalRewards)
  console.log('totalRewardsError ', totalRewardsError)
  console.log('totalRewardsError ', activeBalanceError)

  return useMemo(() => {
    if (
      anjActiveBalance.eq(bigNum(-1)) ||
      antTotalStake.eq(bigNum(-1)) ||
      activeJurors === null
    ) {
      return [null, true]
    }

    const statsData = [
      anjActiveBalance,
      antTotalStake,
      activeJurors,
      totalRewards,
    ]
    return [
      COURT_STATS.map((stat, index) => {
        return {
          ...stat,
          value: statsData[index],
        }
      }),
      false,
    ]
  }, [antTotalStake.toString(), anjActiveBalance.toString(), activeJurors]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCourtStats
