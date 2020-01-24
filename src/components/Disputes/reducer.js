import * as DisputesTypes from '../../types/dispute-status-types'

export const reduceDispute = dispute => {
  return {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    reducedState:
      dispute.state === DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
    rounds: dispute.rounds.map(round => {
      return {
        ...round,
        createdAt: parseInt(round.createdAt) * 1000,
        number: parseInt(round.number),
        jurors: round.jurors.map(juror => ({
          ...juror,
          weight: parseInt(juror.weight, 10),
        })),
      }
    }),
  }
}
