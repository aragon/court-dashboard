import gql from 'graphql-tag'

// Ideally we would check that the round is not settled
// but since we cannot do nested filters we at least can
// check that the juror has voted in the round and the vote hasn't been leaked
export const JurorRewards = gql`
  subscription JurorDraft($id: ID!) {
    juror(id: $id) {
      id
      drafts(where: { rewarded: false, outcome_gt: 1 }) {
        id
        rewarded
        weight
        outcome
        round {
          number
          coherentJurors
          collectedTokens
          jurorFees
          settledPenalties
          dispute {
            id
            finalRuling
          }
        }
      }
    }
  }
`

export const AppealRewards = null
