import { useMemo } from 'react'
import { useTotalActiveBalance, useTotalANTStaked } from './useCourtContracts'
import { useActiveJurorsNumber } from '../hooks/query-hooks'
import { getKnownToken } from '../utils/known-tokens'
import { bigNum } from '../lib/math-utils'
import IconANJ from '../assets/IconANJ.svg'
import IconANT from '../assets/IconANT.svg'

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
]
/**
 * Hook to get the dashboard stats ANJ active balance, ANT total stake and the active jurors number
 * @returns {Array} First item an array with the stats and the second one a loading state
 */
function useCourtStats() {
  const ANJActiveBalance = useTotalActiveBalance()
  const ANTTotalStake = useTotalANTStaked()
  const activeJurors = useActiveJurorsNumber()

  return useMemo(() => {
    if (
      ANJActiveBalance.eq(bigNum(-1)) ||
      ANTTotalStake.eq(bigNum(-1)) ||
      activeJurors === null
    ) {
      return [null, true]
    }

    const statsData = [ANJActiveBalance, ANTTotalStake, activeJurors]
    return [
      COURT_STATS.map((stat, index) => {
        return {
          ...stat,
          value: statsData[index],
        }
      }),
      false,
    ]
  }, [ANTTotalStake.toString(), ANJActiveBalance.toString(), activeJurors]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCourtStats
