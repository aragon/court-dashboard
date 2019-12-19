import { useQuery } from 'urql'
import { JurorDrafts } from '../../../queries/disputes'
import { reduceDispute } from '../reducer'

export default function useJurorDraftQuery(juror) {
  const [result] = useQuery({
    query: JurorDrafts,
    variables: { id: juror },
  })

  return !result.fetching
    ? result.data.juror.drafts.map(draft => reduceDispute(draft.round.dispute))
    : []
}
