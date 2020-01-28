import { useMemo } from 'react'

import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import useDisputeSubscription from './useDisputeSubscription'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString } from '../types/types'

export default function useDispute(disputeId) {
  const courtConfig = useCourtConfig()
  const { dispute, fetching } = useDisputeSubscription(disputeId)

  const now = useNow()

  const disputePhase = useMemo(
    () => (dispute ? getPhaseAndTransition(dispute, courtConfig, now) : ''),
    [courtConfig, dispute, now]
  )
  const disputePhaseKey = convertToString(disputePhase.phase)

  const result = useMemo(() => {
    if (fetching) {
      return { fetching }
    }
    return {
      dispute: {
        ...dispute,
        phase: disputePhase.phase,
        nextTransition: disputePhase.nextTransition,
      },
      fetching,
    }
  }, [dispute, disputePhaseKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return result
}
