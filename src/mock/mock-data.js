import { getCourtAddress } from '../networks'
import dayjs from 'dayjs'

export default {
  // Court configuration
  CourtConfig: {
    courtConfig: {
      id: getCourtAddress(),
      currentTerm: '20',
      termDuration: 240, // 4 minutes
      feeToken: {
        id: '',
        name: 'Dai stablecoin',
        symbol: 'DAI',
        decimals: 18,
      },
      anjToken: {
        id: '',
        name: 'Aragon Network Juror Token',
        symbol: 'ANJ',
        decimals: 18,
      },
      jurorFee: '1000000000000000000',
      draftFee: '180000000000000000',
      settleFee: '110000000000000000',
      evidenceTerms: 21,
      commitTerms: '6',
      revealTerms: '6',
      appealTerms: '6',
      appealConfirmationTerms: '6',
      terms: [
        {
          startTime: dayjs().unix(),
        },
      ],
      finalRoundReduction: '5000',
      firstRoundJurorsNumber: '3',
      appealStepFactor: '3',
      maxRegularAppealRounds: '4',
      appealCollateralFactor: '30000',
      appealConfirmCollateralFactor: '20000',
      minActiveBalance: '100000000000000000000',
      penaltyPct: '1000',
      modules: [
        // type
        // address
      ],
    },
  },
  // First ANJ activation movement
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
  Balances: { juror: undefined },
  ANJWalletBalance: { anjbalance: '0' },
  AppealsByMaker: {
    appeals: [],
  },
  AppealsByTaker: {
    appeals: [],
  },
  JurorDraftsNotRewarded: {
    juror: undefined,
  },
}
