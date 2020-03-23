import { useQuery } from 'urql'

import { JurorFirstANJActivationMovement } from '../queries/balances'
import { JurorDrafts, JurorDraftsRewarded } from '../queries/jurorDrafts'

export function useJurorDraftQuery(jurorId) {
  const [result] = useQuery({
    query: JurorDrafts,
    variables: { id: jurorId?.toLowerCase() },
    pause: !jurorId,
  })

  if (result.fetching || result.error) {
    return []
  }

  const { juror } = result.data || {}

  return juror ? juror.drafts.map(draft => draft.round.dispute.id) : []
}

/**
 * Queries if the juror has ever claimed rewards
 *
 * @param {String} jurorId Address of the juror
 * @returns {Boolean} True if the juror has ever claimed rewards
 */
export function useJurorDraftRewardedQuery(jurorId) {
  const [{ data }] = useQuery({
    query: JurorDraftsRewarded,
    variables: { id: jurorId.toLowerCase() },
  })

  if (!data || !data.juror) {
    return false
  }

  return data.juror.drafts.length > 0
}

export function useFirstANJActivationQuery(jurorId, { pause = false }) {
  const [result] = useQuery({
    query: JurorFirstANJActivationMovement,
    variables: { id: jurorId.toLowerCase() },
    pause,
  })

  const { juror } = result.data || {}

  return juror ? juror.movements[0] : null
}
