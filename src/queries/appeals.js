import gql from 'graphql-tag'

export const AppealsByMaker = gql`
  subscription($maker: Bytes!, $settled: Boolean!) {
    appeals(where: { maker: $maker, settled: $settled }) {
      id
      round {
        dispute {
          id
        }
      }
      maker
      appealDeposit
    }
  }
`

export const AppealsByTaker = gql`
  subscription($taker: Bytes!, $settled: Boolean!) {
    appeals(where: { taker: $taker, settled: $settled }) {
      id
      round {
        dispute {
          id
        }
      }
      taker
      confirmAppealDeposit
    }
  }
`
