import gql from 'graphql-tag'

export const OpenRounds = gql`
  subscription {
    adjudicationRounds(
      where: { state: Committing }
      orderBy: createdAt
      orderDirection: asc
    ) {
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
