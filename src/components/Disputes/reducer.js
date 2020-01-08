import * as DisputesTypes from '../../types/types'

export const reduceDispute = (dispute, courtSettings) => {
  return {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    reducedState:
      dispute.state === DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
  }
}