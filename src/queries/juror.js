import gql from 'graphql-tag'

// First juror subscription claimed
export const JurorFeesClaimed = gql`
  query Juror($id: ID!) {
    juror(id: $id) {
      id
      drafts(where: { rewarded: true }, first: 1) {
        id
      }
      feeMovements(type: "Subscriptions", first: 1) {
        id
      }
    }
  }
`
