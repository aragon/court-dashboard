import { useMemo } from 'react'

import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import useSingleDisputeSubscription, {
  useDisputesSubscription,
} from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString } from '../types/dispute-status-types'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const { disputes } = useDisputesSubscription()
  const now = useNow()

  const disputesPhases = useMemo(
    () => disputes.map(d => getPhaseAndTransition(d, courtConfig, now)),
    [courtConfig, disputes, now]
  )
  const disputesPhasesKey = disputesPhases
    .map(v => convertToString(Object.values(v)[0]))
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

export function useDispute(disputeId) {
  const courtConfig = useCourtConfig()
  const now = useNow()
  const { dispute, fetching } = useSingleDisputeSubscription(disputeId)

  const disputePhase = getPhaseAndTransition(dispute, courtConfig, now)
  const disputePhaseKey = disputePhase
    ? convertToString(Object.values(disputePhase)[0])
    : ''

  return useMemo(() => {
    if (fetching) {
      return { fetching }
    }

    return {
      dispute: {
        ...dispute,
        ...disputePhase,
      },
      fetching,
    }
  }, [dispute, disputePhaseKey]) // eslint-disable-line react-hooks/exhaustive-deps
}
