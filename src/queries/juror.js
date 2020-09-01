import gql from 'graphql-tag'

// First juror subscription claimed
export const JurorFeesClaimed = gql`
  query JurorFeesClaimed($owner: Bytes!) {
    feeMovements(where: { owner: $owner }) {
      id
    }
  }
`

// Last juror fee withdrawal movement
export const JurorLastFeeWithdrawal = gql`
  query JurorLastFeeWithdrawal($owner: Bytes!) {
    feeMovements(
      where: { owner: $owner, type: "Withdraw" }
      orderBy: createdAt
      orderDirection: desc
      first: 1
    ) {
      id
      createdAt
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
