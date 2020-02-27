import gql from 'graphql-tag'

// All juror drafts by `id` not yet rewarded
export const JurorDraftsNotRewarded = gql`
  subscription JurorDraft($id: ID!) {
    juror(id: $id) {
      id
      drafts(where: { rewarded: false }) {
        id
        weight
        locked
        rewarded
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

// Jurors drafts by `id` for current term
export const CurrentTermJurorDrafts = gql`
  subscription JurorDrafts($id: ID!, $from: BigInt!) {
    juror(id: $id) {
      id
      drafts(where: { createdAt_gt: $from }) {
        id
        createdAt
      }
    }
  }
`

// All juror drafts by `id`
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
