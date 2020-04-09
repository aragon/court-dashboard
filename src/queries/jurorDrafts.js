import gql from 'graphql-tag'

// All juror drafts by `id` not yet rewarded
export const JurorDraftsNotRewarded = gql`
  subscription JurorDraftsNotRewarded($id: ID!) {
    juror(id: $id) {
      id
      drafts(where: { rewarded: false }) {
        id
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

// First juror draft already rewarded
export const JurorDraftsRewarded = gql`
  query JurorDraftsRewarded($id: ID!) {
    juror(id: $id) {
      id
      drafts(where: { rewarded: true }, first: 1) {
        id
      }
    }
  }
`

// Jurors drafts for juror with id `$id` created since `$from`
export const JurorDraftsFrom = gql`
  subscription JurorDraftsFrom($id: ID!, $from: BigInt!) {
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
