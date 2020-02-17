import { useQuery } from 'urql'

import { JurorDrafts, JurorDraftRewarded } from '../queries/jurorDrafts'
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

/**
 * Queries if the juror has already recieve rewards
 *
 * @param {String} jurorId Address of the juror
 * @returns {Object} All `jurorId` drafts not yet rewarded
 */
export function useJurorDraftRewardedQuery(jurorId) {
  const [{ data }] = useQuery({
    query: JurorDraftRewarded,
    variables: { id: jurorId },
  })

  if (!data) {
    return false
  }

  return Boolean(data.juror?.drafts?.length > 0)
}

export function useFirstANJActivationQuery(jurorId, { pause = false }) {
  const [result] = useQuery({
    query: FirstANJActivationMovement,
    variables: { id: jurorId },
    pause,
  })

  const { juror } = result.data || {}

  return juror ? juror.movements[0] : null
}
