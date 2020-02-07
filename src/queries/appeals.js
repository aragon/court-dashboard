import gql from 'graphql-tag'

export const AppealsByMaker = gql`
  subscription($maker: Bytes!, $settled: Boolean!) {
    appeals(where: { maker: $maker, settled: $settled }) {
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
          }
        }
      }
      maker
      appealedRuling
      appealDeposit
      taker
      opposedRuling
      confirmAppealDeposit
    }
  }
`

export const AppealsByTaker = gql`
  subscription($taker: Bytes!, $settled: Boolean!) {
    appeals(where: { taker: $taker, settled: $settled }) {
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
          }
        }
      }
      maker
      appealedRuling
      appealDeposit
      taker
      opposedRuling
      confirmAppealDeposit
    }
  }
`
