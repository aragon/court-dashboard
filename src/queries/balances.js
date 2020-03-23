import gql from 'graphql-tag'

export const JurorANJWalletBalance = gql`
  subscription JurorANJWalletBalance($id: ID!) {
    anjbalance(id: $id) {
      amount
    }
  }
`

export const JurorANJBalances = gql`
  subscription JurorANJBalances($id: ID!, $from: BigInt!) {
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

export const JurorFirstANJActivationMovement = gql`
  query JurorFirstANJActivationMovement($id: ID!) {
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
