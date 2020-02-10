import gql from 'graphql-tag'

export const AllDisputes = gql`
  subscription AllDisputes($limit: Int) {
    disputes(first: $limit, orderBy: createdAt, orderDirection: desc) {
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
        id
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
          commitment
          outcome
        }
        vote {
          id
          winningOutcome
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

export const SingleDispute = gql`
  subscription Dispute($id: ID!) {
    dispute(id: $id) {
      id
      txHash
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
      evidences {
        id
        submitter
        data
        createdAt
      }
      rounds {
        id
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
          weight
          commitment
          outcome
        }
        vote {
          id
          winningOutcome
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
