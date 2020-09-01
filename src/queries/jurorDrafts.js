import gql from 'graphql-tag'

// All juror drafts by juror with address `id`
export const JurorDraftsRewards = gql`
  query JurorDraftsRewards($id: ID!) {
    juror(id: $id) {
      id
      drafts {
        id
        rewarded
        rewardedAt
        weight
        outcome
        round {
          number
          coherentJurors
          collectedTokens
          jurorFees
          settledPenalties
          draftTermId
          dispute {
            id
            finalRuling
          }
        }
      }
    }
  }
`

// Jurors drafts for juror with id `$id` created since `$from`
export const JurorDraftsFrom = gql`
  query JurorDraftsFrom($id: ID!, $from: BigInt!) {
    juror(id: $id) {
      id
      drafts(where: { createdAt_gt: $from }) {
        id
        createdAt
      }
    }
  }
`

// All juror drafts for juror with id `id`
// Useful query to know all disputes that the juror by `$id` is part of
export const JurorDrafts = gql`
  query JurorDrafts($id: ID!) {
    juror(id: $id) {
      id
      drafts {
        id
        round {
          id
          dispute {
            id
          }
        }
      }
    }
  }
`
