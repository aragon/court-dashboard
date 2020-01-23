import { useMemo } from 'react'

import useNow from './useNow'
import { useCourtConfig } from '../providers/CourtConfig'
import { useDisputesState } from '../components/Disputes/DisputesStateProvider'
import { useJurorDraftQuery } from './query-hooks'

import { getPhaseAndTransition } from '../utils/dispute-utils'
import { convertToString } from '../types/dispute-status-types'
import { useConnectedAccount } from '../providers/Web3'

export default function useDisputes() {
  const courtConfig = useCourtConfig()
  const { disputes } = useDisputesState()
  const now = useNow()

  const connectedAccount = useConnectedAccount()
  const jurorDisputes = useJurorDraftQuery(connectedAccount) // TODO: should we do this query when the tab changes ?

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
    }, [disputes, disputesPhasesKey]), // eslint-disable-line react-hooks/exhaustive-deps
    jurorDisputes,
  ]
}

export function useDispute(dispute) {
  const courtConfig = useCourtConfig()
  const now = useNow()

  if (!dispute) return

  return {
    ...dispute,
    ...getPhaseAndTransition(dispute, courtConfig, now),
  }
}
