import gql from 'graphql-tag'

export const AllDisputes = gql`
  subscription AllDisputes($limit: Int) {
    disputes(first: $limit, orderBy: createdAt, orderDirection: desc) {
      id
      finalRuling
      lastRoundId
      state
      metadata
      rounds {
        id
        state
        number
        draftTermId
        delayedTerms
        jurors {
          juror {
            id
          }
          commitment
          outcome
        }

        appeal {
          id
        }
      }
    }
  }
`

export const SingleDispute = gql`
  subscription SingleDispute($id: ID!) {
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
      subject {
        id
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
          commitmentDate
          outcome
          revealDate
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
          confirmedAt
        }
      }
    }
  }
`
