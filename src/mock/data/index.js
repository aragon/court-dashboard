import Court from '../models/Court'
import { ANJMovementType } from '../types'
import {
  removeAppealCircularReferences,
  removeJurorCircularReferences,
  removeRoundCircularReferences,
} from '../helper'

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
  JurorsRegistryModule: () => ({
    jurorsRegistryModule: court.jurorsRegistryModule,
  }),

  FeeMovements: () => ({ feeMovements: [] }),

  JurorFeesClaimed: ({ owner }) => ({ feeMovements: [] }),

  ActiveJurors: () => ({
    jurors: court.jurors.map(juror => ({ id: juror.id })),
  }),
  // Get first activation movements for juror with id `id`
  JurorFirstANJActivationMovement: ({ id }) => {
    const { anjMovements } = court.getJuror(id) || {}
    const firstActivationMovement = anjMovements?.find(
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
      anjMovements,
    } = juror || {}

    return {
      juror: juror
        ? {
            activeBalance,
            lockedBalance,
            availableBalance,
            deactivationBalance,
            treasuryTokens,
            anjMovements,
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

  AppealsByMaker: ({ maker }) => {
    const appeals = court.getAppealsByMaker(maker)

    return {
      appeals: appeals.map(({ taker, ...appeal }) =>
        removeAppealCircularReferences(appeal)
      ),
    }
  },

  AppealsByTaker: ({ taker }) => {
    const appeals = court.getAppealsByTaker(taker)

    return {
      appeals: appeals.map(({ maker, ...appeal }) =>
        removeAppealCircularReferences(appeal)
      ),
    }
  },

  JurorDraftsFrom: ({ id, from }) => {
    const juror = removeJurorCircularReferences(court.getJuror(id))

    return {
      juror: {
        id,
        drafts: juror.drafts.filter(draft => draft.createdAt >= from),
      },
    }
  },

  JurorDraftsNotRewarded: ({ id }) => {
    const juror = removeJurorCircularReferences(court.getJuror(id))
    const { drafts = [] } = juror || {}

    return {
      juror: {
        id,
        drafts: drafts.filter(draft => !draft.rewarded),
      },
    }
  },

  /** **** DISPUTES *****/

  // Get all disputes
  AllDisputes: () => ({
    disputes: court.disputes.map(dispute => ({
      ...dispute,
      rounds: dispute.rounds.map(removeRoundCircularReferences),
    })),
  }),

  // Get dispute with id `id`
  SingleDispute: ({ id }) => {
    const dispute = court.getDispute(id)
    return {
      dispute: {
        ...dispute,
        rounds: dispute.rounds.map(removeRoundCircularReferences),
      },
    }
  },

  // Get all juror drafts for juror with id `id`
  JurorDrafts: ({ id }) => {
    const juror = removeJurorCircularReferences(court.getJuror(id))
    const { drafts = [] } = juror || {}

    return {
      juror: {
        drafts,
      },
    }
  },

  // Get all open tasks
  OpenTasks: ({ state }) => {
    const rounds = court.getRoundsByState(state)
    return {
      adjudicationRounds: rounds.map(removeRoundCircularReferences),
    }
  },
}
