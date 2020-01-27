import { useQuery } from 'urql'
import { JurorDrafts } from '../queries/disputes'
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
