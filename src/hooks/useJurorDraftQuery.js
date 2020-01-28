import { useQuery } from 'urql'
import { JurorDrafts } from '../queries/disputes'
import { transformResponseDisputeAttributes } from '../utils/dispute-utils'

export default function useJurorDraftQuery(juror) {
  const [result] = useQuery({
    query: JurorDrafts,
    variables: { id: juror },
  })

  if (result.fetching || result.error) {
    return []
  }

  return result.data.juror
    ? result.data.juror.drafts.map(draft =>
        transformResponseDisputeAttributes(draft.round.dispute)
      )
    : []
}
