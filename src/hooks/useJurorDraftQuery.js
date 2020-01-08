import { useQuery } from 'urql'
import { JurorDrafts } from '../queries/disputes'
import { reduceDispute } from '../components/Disputes/reducer'

export default function useJurorDraftQuery(juror) {
  const [result] = useQuery({
    query: JurorDrafts,
    variables: { id: juror },
  })

  return !result.fetching && !result.error
    ? result.data.juror
      ? result.data.juror.drafts.map(draft =>
          reduceDispute(draft.round.dispute)
        )
      : []
    : []
}