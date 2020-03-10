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
      treasuryTokens {
        token {
          id
          name
          symbol
          decimals
        }
        balance
      }
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

export const FirstANJActivationMovement = gql`
  query Juror($id: ID!) {
    juror(id: $id) {
      movements(
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
export const ActiveJurors = gql`
  query Jurors {
    jurors(first: 1000, where: { activeBalance_gt: 0 }) {
      id
    }
  }
`
