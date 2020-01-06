import gql from 'graphql-tag'

export const ANJBalance = gql`
  subscription ANJBalance($id: ID!) {
    anjbalance(id: $id) {
      amount
    }
  }
`

export const Juror = gql`
  subscription Juror($id: ID!, $from: BigInt!) {
    juror(id: $id) {
      activeBalance
      lockedBalance
      availableBalance
      deactivationBalance
      movements(
        orderBy: createdAt
        orderDirection: desc
        where: { createdAt_gt: $from }
      ) {
        amount
        effectiveTermId
        createdAt
        type
      }
    }
  }
`
