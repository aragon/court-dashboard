import gql from 'graphql-tag'

export const CourtConfig = gql`
  subscription {
    courtConfig(id: "0xc89ce4735882c9f0f0fe26686c53074e09b0d550") {
      id
      termDuration
      currentTerm
      feeToken {
        id
        symbol
        name
        decimals
      }
      anjToken {
        id
        symbol
        name
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
      modules {
        id
        address
        type
      }
    }
  }
`
