import gql from 'graphql-tag'

export const AppealsByMaker = gql`
  subscription AppealsByMaker($maker: Bytes!, $settled: Boolean!) {
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
            number
          }
        }
      }
      maker
      appealedRuling
      appealDeposit
      opposedRuling
      confirmAppealDeposit
    }
  }
`

export const AppealsByTaker = gql`
  subscription AppealsByTaker($taker: Bytes!, $settled: Boolean!) {
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
            number
          }
        }
      }
      appealedRuling
      appealDeposit
      taker
      opposedRuling
      confirmAppealDeposit
    }
  }
`
