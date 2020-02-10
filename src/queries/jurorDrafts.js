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

// TODO: Check if all the data is necessary
// All juror drafts by `id`
export const JurorDrafts = gql`
  query JurorDrafts($id: ID!) {
    juror(id: $id) {
      id
      drafts {
        id
        weight
        rewarded
        commitment
        outcome
        leaker
        createdAt
        round {
          id
          number
          dispute {
            id
            txHash
            createTermId
            possibleRulings
            finalRuling
            lastRoundId
            state
            metadata
            createdAt
            rounds {
              state
              number
              draftTermId
              jurorsNumber
              settledPenalties
              jurorFees
              delayedTerms
              selectedJurors
              coherentJurors
              collectedTokens
              createdAt
              jurors {
                juror {
                  id
                }
              }
              appeal {
                id
                maker
                appealedRuling
                taker
                opposedRuling
                settled
                createdAt
              }
            }
          }
        }
      }
    }
  }
`
