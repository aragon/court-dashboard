import { useMemo } from 'react'

import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import {
  useSingleDisputeSubscription,
  useDisputesSubscription,
} from './subscription-hooks'
import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString } from '../types/dispute-status-types'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const { disputes, fetching, error } = useDisputesSubscription()

  const now = useNow() // TODO: use court clock

  const disputesPhases = useMemo(() => {
    if (!disputes) {
      return null
    }

    return disputes.map(d => getPhaseAndTransition(d, courtConfig, now))
  }, [courtConfig, disputes, now])

  const disputesPhasesKey = disputesPhases
    ? disputesPhases.map(v => convertToString(Object.values(v)[0])).join('')
    : null

  return useMemo(() => {
    if (error) {
      return { error }
    }

    if (fetching) {
      return { fetching }
    }

    return {
      disputes: disputes.map((dispute, i) => ({
        ...dispute,
        ...disputesPhases[i],
      })),
    }
  }, [disputesPhases, disputes, disputesPhasesKey, error]) // eslint-disable-line react-hooks/exhaustive-deps
}

export function useDispute(disputeId) {
  const courtConfig = useCourtConfig()
  const now = useNow() // TODO: use court clock
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
