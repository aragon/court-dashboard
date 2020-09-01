import gql from 'graphql-tag'

export const JurorANJWalletBalance = gql`
  query JurorANJWalletBalance($id: ID!) {
    anjbalance(id: $id) {
      amount
    }
  }
`

export const JurorANJBalances = gql`
  query JurorANJBalances($id: ID!, $from: BigInt!) {
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
  query JurorTreasuryBalances($owner: Bytes!) {
    treasuryBalances(where: { owner: $owner }) {
      token {
        id
      }
      amount
    }
  }
`

export const JurorFirstANJActivationMovement = gql`
  query JurorFirstANJActivationMovement($id: ID!) {
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
