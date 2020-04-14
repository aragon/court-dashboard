import gql from 'graphql-tag'

// First juror subscription claimed
export const JurorFeesClaimed = gql`
  query JurorFeesClaimed($owner: Bytes!) {
    feeMovements(where: { owner: $owner }) {
      id
    }
  }
`

export const ActiveJurors = gql`
  query ActiveJurors {
    jurors(first: 1000, where: { activeBalance_gt: 0 }) {
      id
    }
  }
`
