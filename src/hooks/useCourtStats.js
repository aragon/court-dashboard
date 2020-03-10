import { useMemo } from 'react'
import { useTotalActiveBalance, useTotalANTStaked } from './useCourtContracts'
// import { useCourtClock } from '../providers/CourtClock'
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
  // const [fetching, setFetching] = useState(true)
  // const { currentTermId } = useCourtClock()

  const ANJActiveBalance = useTotalActiveBalance()
  console.log('ANJActiveBalance ', ANJActiveBalance)

  const ANTTotalStake = useTotalANTStaked()
  console.log('ANTTotalStake ', ANTTotalStake)

  return useMemo(() => {
    if (!ANJActiveBalance.eq(bigNum(-1)) && !ANTTotalStake.eq(bigNum(-1))) {
      return [null, true]
    }

    const statsData = [ANJActiveBalance, ANTTotalStake]
    return [
      COURT_STATS.map((stat, index) => {
        return {
          ...stat,
          value: statsData[index],
        }
      }),
      false,
    ]
  }, [ANTTotalStake.toString(), ANJActiveBalance.toString()]) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useCourtStats
