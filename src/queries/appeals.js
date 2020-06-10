import gql from 'graphql-tag'

export const AppealsByMaker = gql`
  subscription AppealsByMaker($maker: Bytes!) {
    appeals(where: { maker: $maker }) {
      id
      round {
        number
        settledPenalties
        dispute {
          id
          finalRuling
          lastRoundId
          rounds {
            jurorsNumber
            number
          }
        }
      }
      maker
      appealedRuling
      appealDeposit
      opposedRuling
      confirmAppealDeposit
      settled
      settledAt
    }
  }
`

export const AppealsByTaker = gql`
  subscription AppealsByTaker($taker: Bytes!) {
    appeals(where: { taker: $taker }) {
      id
      round {
        number
        settledPenalties
        dispute {
          id
          finalRuling
          lastRoundId
          rounds {
            jurorsNumber
            number
          }
        }
      }
      appealedRuling
      appealDeposit
      taker
      opposedRuling
      confirmAppealDeposit
      settled
      settledAt
    }
  }
`
