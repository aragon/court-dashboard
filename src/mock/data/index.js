import { bigExp } from '../helper'
import Court from '../models/Court'
import { ANJMovementType } from '../types'

const court = new Court()

// Each key of this Object is the name of the respective query that we have declared (see all query names at ./queries folder)
// And the value is the function that resolves said query (by resolving we mean returns the respective mocked data)
export default {
  /** **** COURT CONFIG *****/

  CourtConfig: () => ({
    courtConfig: court.config,
  }),

  /** **** DASHBOARD STATE *****/

  // Get Court JurorRegistry module
  JurorsRegistryModule: ({ id }) => ({
    jurorsRegistryModule: court.jurorsRegistryModule,
  }),

  FeeMovements: () => ({ feeMovements: [] }),

  JurorFeesClaimed: ({ owner }) => ({}),

  ActiveJurors: () => ({ jurors: [] }),
  // Get first activation movements for juror with id `id`
  JurorFirstANJActivationMovement: ({ id }) => {
    const { movements } = court.getJuror(id) || {}
    const firstActivationMovement = movements?.find(
      movement => movement.type === ANJMovementType.Activation
    )

    return {
      juror: {
        anjMovements: firstActivationMovement ? [firstActivationMovement] : [],
      },
    }
  },

  // Get active, inactive, locked and deactivation balances along with movements for juror with id `id`
  JurorANJBalances: ({ id }) => {
    const juror = court.getJuror(id)
    const {
      activeBalance,
      lockedBalance,
      availableBalance,
      deactivationBalance,
      treasuryTokens,
      movements,
    } = juror || {}

    return {
      juror: juror
        ? {
            activeBalance,
            lockedBalance,
            availableBalance,
            deactivationBalance,
            treasuryTokens,
            movements,
          }
        : null,
    }
  },

  // Get wallet balance for juror with id `id`
  JurorANJWalletBalance: ({ id }) => {
    const { walletBalance } = court.getJuror(id) || {}
    return { anjbalance: walletBalance }
  },

  JurorTreasuryBalances: ({ owner }) => [],

  AppealsByMaker: ({ maker }) => ({
    appeals: [],
  }),
  AppealsByTaker: ({ taker }) => ({
    appeals: [],
  }),
  JurorDraftsFrom: ({ id, from }) => ({
    drafts: [],
  }),
  JurorDraftsRewarded: ({ id }) => ({
    juror: {
      id: '',
      drafts: [],
    },
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

  /** **** DISPUTES *****/

  // Get all disputes
  AllDisputes: () => ({
    disputes: court.disputes,
  }),

  // Get dispute with id `id`
  SingleDispute: ({ id }) => {
    const dispute = court.getDispute(id)
    return {
      dispute,
    }
  },

  // Get all juror drafts for juror with id `id`
  JurorDrafts: ({ id }) => ({
    juror: {
      id: '',
      drafts: [],
    },
  }),

  // Get all open tasks
  OpenTasks: () => ({
    adjudicationRounds: [],
  }),
}
