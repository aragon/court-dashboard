import gql from 'graphql-tag'

export const ANJBalance = gql`
  subscription ANJWalletBalance($id: ID!) {
    anjbalance(id: $id) {
      amount
    }
  }
`

export const Juror = gql`
  subscription Balances($id: ID!, $from: BigInt!) {
    juror(id: $id) {
      activeBalance
      lockedBalance
      availableBalance
      deactivationBalance
      withdrawalsLockTermId
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
      claimedSubscriptionFees {
        id
        period {
          id
        }
      }
    }
  }
`

export const JurorTreasuryBalances = gql`
  subscription JurorTreasuryBalances($owner: Bytes!) {
    treasuryBalances(where: { owner: $owner }) {
      token {
        id
      }
      amount
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
export const ActiveJurors = gql`
  query Jurors {
    jurors(first: 1000, where: { activeBalance_gt: 0 }) {
      id
    }
  }
`
