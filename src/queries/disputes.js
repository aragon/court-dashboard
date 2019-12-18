import gql from 'graphql-tag'

export const AllDisputes = gql`
  subscription {
    disputes {
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
