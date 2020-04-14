import { courtServerEndpoint } from '../endpoints'
import { getVoteId, hashPassword } from '../utils/crvoting-utils'

const COURT_SERVER_ENDPOINT = courtServerEndpoint()

export default async (juror, disputeId, roundId, outcome, password) => {
  const voteId = getVoteId(disputeId, roundId).toString()
  const salt = hashPassword(password)

  return fetch(`${COURT_SERVER_ENDPOINT}/reveals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      juror,
      voteId,
      outcome: outcome.toString(),
      salt,
    }),
  })
    .then(res => res.json())
    .then(revealData => {
      const errors = revealData.errors
        ?.map(err => Object.values(err).join(', '))
        .join(', ')

      if (errors) {
        throw new Error(`Failed to request auto-reveal service ${errors}`)
      }

      return revealData
    })
}
