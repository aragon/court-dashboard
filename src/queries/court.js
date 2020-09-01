import gql from 'graphql-tag'

export const CourtConfig = gql`
  query CourtConfig($id: ID!) {
    courtConfig(id: $id) {
      id
      currentTerm
      termDuration
      feeToken {
        id
        name
        symbol
        decimals
      }
      anjToken {
        id
        name
        symbol
        decimals
      }
      jurorFee
      draftFee
      settleFee

      evidenceTerms
      commitTerms
      revealTerms
      appealTerms
      appealConfirmationTerms
      terms {
        id
        startTime
      }
      finalRoundReduction
      firstRoundJurorsNumber
      appealStepFactor
      maxRegularAppealRounds
      appealCollateralFactor
      appealConfirmCollateralFactor
      minActiveBalance
      penaltyPct
      subscriptions {
        id
        currentPeriod
        feeAmount
        periodDuration
        periods {
          id
          collectedFees
        }
      }
      modules {
        type
        address
      }
      terms {
        id
        startTime
      }
    }
  }
`
export const JurorsRegistryModule = gql`
  query JurorsRegistryModule($id: ID!) {
    jurorsRegistryModule(id: $id) {
      id
      totalStaked
      totalActive
    }
  }
`

export const FeeMovements = gql`
  query FeeMovements {
    feeMovements(where: { type_not: Withdraw }) {
      id
      type
      amount
      createdAt
    }
  }
`
