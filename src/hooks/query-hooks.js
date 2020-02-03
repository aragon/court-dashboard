import { useQuery } from 'urql'
import { JurorDrafts } from '../queries/disputes'
import { FirstANJActivationMovement } from '../queries/balances'

import { transformResponseDisputeAttributes } from '../utils/dispute-utils'

export function useJurorDraftQuery(jurorId) {
  const [result] = useQuery({
    query: JurorDrafts,
    variables: { id: jurorId },
  })

  if (result.fetching || result.error) {
    return []
  }

  const { juror } = result.data || {}

  return juror
    ? juror.drafts.map(draft =>
        transformResponseDisputeAttributes(draft.round.dispute)
      )
    : []
}

export function useFirstANJActivation(jurorId, { pause = false }) {
  const [result] = useQuery({
    query: FirstANJActivationMovement,
    variables: { id: jurorId },
    pause,
  })

  const { juror } = result.data || {}

  return juror ? juror.movements[0] : null
}
