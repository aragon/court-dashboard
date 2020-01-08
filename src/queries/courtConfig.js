import gql from 'graphql-tag'

export const CourtConfig = gql`
  subscription CourtConfig($id: ID!) {
    courtConfig(id: $id) {
      currentTerm
      termDuration
      feeToken {
        name
        symbol
        decimals
      }
      anjToken {
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
      penaltyPct
      finalRoundReduction
      firstRoundJurorsNumber
      appealStepFactor
      maxRegularAppealRounds
      finalRoundLockTerms
      appealCollateralFactor
      appealConfirmCollateralFactor
      minActiveBalance
      fundsGovernor
      configGovernor
      modulesGovernor
    }
  }
`
