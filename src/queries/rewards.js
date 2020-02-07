import gql from 'graphql-tag'

export const JurorRewards = gql`
  subscription JurorDraft($id: ID!, $minOutcome: Int!) {
    juror(id: $id) {
      id
      drafts(where: { rewarded: false, outcome_gte: $minOutcome }) {
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
