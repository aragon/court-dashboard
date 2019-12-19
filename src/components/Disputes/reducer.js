import * as DisputesTypes from './types'

export const reduceDispute = dispute => {
  return {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    reducedState:
      dispute.state === DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,

    /* TO-DO This should be reduced using Facu's suggestions about how to calculate it */
    currentPhase:
      DisputesTypes.convertFromString(dispute.state) ===
      DisputesTypes.Phase.JuryDrafting
        ? DisputesTypes.Phase.JuryDrafting
        : DisputesTypes.convertFromString(dispute.state) ===
          DisputesTypes.Phase.Evidence
        ? DisputesTypes.Phase.Evidence
        : dispute.rounds &&
          DisputesTypes.convertFromString(
            dispute.rounds[dispute.rounds.length - 1].state
          ),
  }
}
