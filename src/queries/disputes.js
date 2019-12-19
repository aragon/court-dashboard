import gql from 'graphql-tag'

export const AllDisputes = gql`
  subscription {
    disputes(orderBy: createdAt, orderDirection: desc) {
      id
      createTermId
      possibleRulings
      finalRuling
      lastRoundId
      state
      metadata
      createdAt
      subject {
        id
      }
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
`

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
            createTermId
            possibleRulings
            finalRuling
            lastRoundId
            state
            metadata
            createdAt
            subject {
              id
            }
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
