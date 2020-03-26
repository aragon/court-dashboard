import { useQuery } from 'urql'

import { JurorDrafts } from '../queries/jurorDrafts'
import { JurorFeesClaimed } from '../queries/juror'
import { FirstANJActivationMovement } from '../queries/balances'

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
 * Queries if the juror  by id `jurorId` has ever claimed rewards
 * Rewards can be claimed from two places: Subscriptions fees or Dispute fees (the later includes appeal and juror fees)
 *
 * @param {String} jurorId Address of the juror
 * @returns {Boolean} True if juror has ever claimed rewards
 */
export function useJurorRewardsEverClaimedQuery(jurorId) {
  const [{ data }] = useQuery({
    query: JurorFeesClaimed,
    variables: { owner: jurorId.toLowerCase() },
  })

  if (!data) {
    return false
  }

  return data.feeMovements.length > 0
}

export function useFirstANJActivationQuery(jurorId, { pause = false }) {
  const [result] = useQuery({
    query: FirstANJActivationMovement,
    variables: { id: jurorId.toLowerCase() },
    pause,
  })

  const { juror } = result.data || {}

  return juror ? juror.anjMovements[0] : null
}
