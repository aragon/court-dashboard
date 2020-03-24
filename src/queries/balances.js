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
      withdrawalsLockTermId
      treasuryBalances {
        token {
          id
          name
          symbol
          decimals
        }
        amount
      }
      anjMovements(
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

export const FirstANJActivationMovement = gql`
  query Juror($id: ID!) {
    juror(id: $id) {
      anjMovements(
        where: { type: "Activation" }
        orderBy: createdAt
        orderDirection: asc
        first: 1
      ) {
        amount
        effectiveTermId
        createdAt
        type
      }
    }
  }
`
