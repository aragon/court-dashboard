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

const STATS_FETCHING_TIMEOUT = 15000

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

export function useTotalActiveBalance() {
  const { data: jurorRegistryStats, error } = useJurorRegistrySubscription()

  return useMemo(() => {
    if (!jurorRegistryStats || error) {
      return [bigNum(-1), error]
    }
    return [bigNum(jurorRegistryStats.totalActive), error]
  }, [error, jurorRegistryStats])
}

function useTotalRewards() {
  const { data: rewards, error } = useTotalRewardsSubscription()

  return useMemo(() => {
    if (!rewards || error) {
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
  const [anjActiveBalance, anjActiveBalanceError] = useTotalActiveBalance()
  const [antTotalStake, antTotalStakeError] = useTotalANTStakedPolling(
    STATS_FETCHING_TIMEOUT
  )
  const [activeJurors, activeJurorsError] = useActiveJurorsNumber()
  const [totalRewards, totalRewardsError] = useTotalRewards()

  // Loading states
  const anjFetching = anjActiveBalance.eq(bigNum(-1)) && !anjActiveBalanceError
  const antFetching = antTotalStake.eq(bigNum(-1)) && !antTotalStakeError
  const activeJurorsFetching = activeJurors === null && !activeJurorsError
  const totalRewardsFetching = totalRewards.eq(bigNum(-1)) && !totalRewardsError

  return useMemo(
    () => {
      if (
        anjFetching ||
        antFetching ||
        activeJurorsFetching ||
        totalRewardsFetching
      ) {
        return [null, true]
      }

      const statsData = [
        anjActiveBalance,
        antTotalStake,
        activeJurors,
        totalRewards,
      ]
      const statsError = [
        anjActiveBalanceError,
        antTotalStakeError,
        activeJurorsError,
        totalRewardsError,
      ]
      return [
        COURT_STATS.map((stat, index) => {
          return {
            ...stat,
            value: statsData[index],
            error: statsError[index],
          }
        }),
        false,
      ]
    } /* eslint-disable react-hooks/exhaustive-deps */,
    [
      activeJurors,
      activeJurorsError,
      activeJurorsFetching,
      anjActiveBalance.toString(),
      anjActiveBalanceError,
      anjFetching,
      antFetching,
      antTotalStake.toString(),
      antTotalStakeError,
      totalRewards.toString(),
      totalRewardsError,
      totalRewardsFetching,
    ]
    /* eslint-disable-line react-hooks/exhaustive-deps */
  )
}

export default useCourtStats
