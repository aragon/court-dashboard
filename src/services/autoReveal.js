import { courtServerEndpoint } from '../endpoints'
import { getVoteId, hashPassword } from '../utils/crvoting-utils'

const COURT_SERVER_ENDPOINT = courtServerEndpoint()

export async function requestAutoReveal(
  juror,
  disputeId,
  roundId,
  outcome,
  password
) {
  const voteId = getVoteId(disputeId, roundId).toString()
  const salt = hashPassword(password)

  try {
    const rawResponse = await fetch(`${COURT_SERVER_ENDPOINT}/reveals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        juror: juror.toLowerCase(),
        voteId,
        outcome: outcome.toString(),
        salt,
      }),
    })

    if (rawResponse.ok) {
      return
    }

    const response = await rawResponse.json()
    const errors = response.errors
      .map(err => Object.values(err).join(', '))
      .join(', ')

    throw new Error(
      `Failed to request auto-reveal service due to errors: ${errors}`
    )
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getAutoRevealRequest(juror, disputeId, roundId) {
  const voteId = getVoteId(disputeId, roundId).toString()

  try {
    const rawResponse = await fetch(
      `${COURT_SERVER_ENDPOINT}/reveals/${juror}/${voteId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    if (rawResponse.ok) {
      const { reveal } = await rawResponse.json()
      return reveal
    }

    return null
  } catch (err) {
    console.error(err)
    throw err
  }
}
