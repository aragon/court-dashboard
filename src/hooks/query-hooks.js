import { useQuery } from 'urql'

import { JurorDrafts } from '../queries/jurorDrafts'
import { JurorFeesClaimed } from '../queries/juror'
import { ActiveJurors, FirstANJActivationMovement } from '../queries/balances'

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
 * Queries if juror has ever claimed any rewards
 *
 * @param {String} jurorId Address of the juror
 * @returns {Boolean} True if juror has already claimed rewards
 */
export function useJurorRewardsClaimedQuery(jurorId) {
  const [{ data }] = useQuery({
    query: JurorFeesClaimed,
    variables: { id: jurorId.toLowerCase() },
  })

  if (!data || !data.juror) {
    return false
  }

  const {
    drafts: rewardedDrafts,
    feeMovements: claimedSubscriptionFeeMovements,
  } = data.juror

  return rewardedDrafts.length > 0 || claimedSubscriptionFeeMovements.length > 0
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

export function useActiveJurorsNumber() {
  const [result] = useQuery({
    query: ActiveJurors,
  })

  const { jurors } = result.data || {}

  return jurors?.length
}
