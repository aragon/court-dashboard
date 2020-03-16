import { bigExp } from '../helper'
import courtConfig from './CourtConfig'
import disputes from './Disputes'
import { jurorMovements, jurorBalances, jurorWalletBalance } from './Balances'

export default {
  // Court configuration
  CourtConfig: () => ({
    courtConfig,
  }),
  // Dashboard state
  JurorFirstANJActivationMovement: () => ({
    juror: {
      movements: jurorMovements[0],
    },
  }),
  Balances: ({ id }) => ({
    juror: jurorBalances,
  }),
  ANJWalletBalance: ({ id }) => ({ anjbalance: jurorWalletBalance }),
  CurrentTermJurorDrafts: ({ id }) => ({
    drafts: [],
  }),
  AppealsByMaker: ({ maker }) => ({
    appeals: [],
  }),
  AppealsByTaker: ({ taker }) => ({
    appeals: [],
  }),
  JurorDraftsNotRewarded: ({ id }) => ({
    juror: {
      id: '',
      drafts: [
        {
          weight: 3,
          outcome: 4,
          round: {
            number: '1',
            coherentJurors: '1',
            collectedTokens: bigExp('20'),
            jurorFees: bigExp('10'),
            settledPenalties: true,
            dispute: {
              id: '1',
              finalRuling: 4,
            },
          },
        },
      ],
    },
  }),
  JurorDraftRewarded: ({ id }) => ({
    juror: {
      id: '',
      drafts: [],
    },
  }),
  // Disputes
  AllDisputes: () => ({
    disputes,
  }),
  SingleDispute: ({ id }) => {
    const dispute = disputes.find(d => d.id === id)
    return {
      dispute,
    }
  },
  JurorDrafts: ({ id }) => ({
    juror: {
      id: '',
      drafts: [],
    },
  }),
  // Tasks
  OpenTasks: () => ({
    adjudicationRounds: [],
  }),
}
