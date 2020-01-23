import { useMemo } from 'react'
import useNow from './useNow'
import useDisputeSubscription from './useDisputesSubscription'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { useCourtConfig } from '../providers/CourtConfig'
import { convertToString } from '../types/types'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const disputes = useDisputeSubscription()
  const now = useNow()

  const disputesPhases = disputes.map(d =>
    getPhaseAndTransition(d, courtConfig, now)
  )
  const disputesPhasesKey = disputesPhases
    .map(v => convertToString(v[Object.keys(v)[0]]))
    .join('')

  console.log('disputesPhasesKey ', disputesPhasesKey)
  return [
    useMemo(() => {
      return disputes.map((dispute, i) => ({
        ...dispute,
        ...disputesPhases[i],
      }))
    }, [disputes, disputesPhasesKey]), // eslint-disable-line react-hooks/exhaustive-deps
  ]
}
