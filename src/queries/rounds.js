import gql from 'graphql-tag'

export const AllRounds = gql`
  subscription {
    adjudicationRounds(orderBy: createdAt, orderDirection: asc) {
      number
      state
      createdAt
      draftTermId
      delayedTerms
      jurors {
        id
        commitment
        outcome
        juror {
          id
        }
      }
      dispute {
        id
        state
        rounds {
          id
        }
      }
    }
  }
`
