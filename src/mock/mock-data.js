export default {
  CourtConfig: {
    courtConfig: {
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
  }

  JurorFirstANJActivationMovement: {
    juror: {
      movements: [
        {
          amount: '0',
          effectiveTermId: '111',
          createdAt: '903033',
          type: 'Activation',
        },
      ],
    },
  },
}
