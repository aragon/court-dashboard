import gql from 'graphql-tag'

// First juror subscription claimed
export const JurorFeesClaimed = gql`
  query JurorFeesClaimed($owner: Bytes!) {
    feeMovements(where: { owner: $owner }) {
      id
    }
  }
`
