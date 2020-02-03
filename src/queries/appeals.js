import gql from 'graphql-tag'

export const AppealsByUser = gql`
  subscription($account: Bytes!, $settled: Boolean!) {
    appeals(where: { maker: $account, settled: $settled })
    id
    round {
      dispute {
        id
      }
    }
    maker
    taker
  }
`
