import gql from 'graphql-tag'

export const OpenTasks = gql`
  subscription OpenTasks($state: [Int]) {
    adjudicationRounds(
      where: { stateInt_in: $state }
      orderBy: createdAt
      orderDirection: asc
    ) {
      number
      stateInt
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
