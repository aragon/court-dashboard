import { COURT_SERVER_ENDPOINT } from '../endpoints'
import { getVoteId, hashPassword } from '../utils/crvoting-utils'

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
      // The API returns a single error message
      // or multiple errors with the following structure example
      // [ {
      //      salt: 'Signature does not correspond to the juror address provided'
      //    }
      //    {
      //      outcome: 'An outcome must be given'
      //    },
      //  ]
      const errors = revealData.errors
        ? revealData.errors.map(err => Object.values(err).join(', ')).join(', ')
        : null

      const errorMessage = revealData.error || errors
      if (errorMessage) {
        throw new Error(`Failed to request auto-reveal service ${errorMessage}`)
      }

      return revealData
    })
}
