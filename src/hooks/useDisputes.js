import { useMemo } from 'react'
import useNow from './useNow'
import useDisputeSubscription from './useDisputesSubscription'
import { getPhaseAndTransition } from '../utils/disputeUtils'
import { useCourtSettings } from '../court-settings-manager'
import { convertToString } from '../types/types'

export default function useDisputes() {
  const courtSettings = useCourtSettings()
  console.log('Court sett ', courtSettings)
  const disputes = useDisputeSubscription()
  const now = useNow()

  const disputesPhases = disputes.map(d =>
    getPhaseAndTransition(d, courtSettings, now)
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
  ]
}
