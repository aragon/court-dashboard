import gql from 'graphql-tag'

export const AllRounds = gql`
  query {
    adjudicationRounds(
      where: { state: Invalid }
      orderBy: createdAt
      orderDirection: asc
    ) {
      id
      number
      state
      createdAt
      dispute {
        id
        state
        rounds
      }
      jurors {
        id
        juror {
          id
        }

        commitment
        outcome
      }
    }
  }
`
