import { useMemo } from 'react'

import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import { useSingleDisputeSubscription } from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString } from '../types/dispute-status-types'

let previousDispute = {}
export default function useDispute(disputeId) {
  const courtConfig = useCourtConfig()
  const { dispute, fetching } = useSingleDisputeSubscription(disputeId)

  const now = useNow()

  const disputePhase = useMemo(
    () => (dispute ? getPhaseAndTransition(dispute, courtConfig, now) : ''),
    [courtConfig, dispute, now]
  )

  console.log('disputePhase ', disputePhase)
  const disputePhaseKey = convertToString(disputePhase.phase)

  const ret = useMemo(() => {
    if (fetching) {
      return { fetching }
    }
    return {
      dispute: {
        ...dispute,
        phase: disputePhase.phase,
      },
      fetching,
    }
  }, [dispute, disputePhaseKey]) // eslint-disable-line react-hooks/exhaustive-deps

  console.log(
    'Previous dispute equal ',
    dispute === previousDispute.dispute,
    fetching === previousDispute.fetching,
    disputePhase === previousDispute.disputePhase,
    disputePhaseKey === previousDispute.disputePhaseKey,
    ret === previousDispute.ret
  )

  previousDispute = { dispute, fetching, disputePhase, disputePhaseKey, ret }

  return ret
}
