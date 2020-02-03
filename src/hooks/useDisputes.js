import { useMemo } from 'react'
import useNow from './useNow'
import { useDisputesSubscription } from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { useCourtConfig } from '../providers/CourtConfig'
import { convertToString } from '../types/types'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const { disputes } = useDisputesSubscription()
  const now = useNow()

  const disputesPhases = disputes.map(d =>
    getPhaseAndTransition(d, courtConfig, now)
  )
  const disputesPhasesKey = disputesPhases
    .map(v => convertToString(v[Object.keys(v)[0]]))

    .join('')

  return [
    useMemo(() => {
      return disputes.map((dispute, i) => ({
        ...dispute,
        ...disputesPhases[i],
      }))
    }, [disputesPhases, disputes, disputesPhasesKey]), // eslint-disable-line react-hooks/exhaustive-deps
  ]
}
