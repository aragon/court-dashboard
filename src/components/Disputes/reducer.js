import * as DisputesTypes from '../../types/dispute-status-types'
import { getOutcomeNumber } from '../../utils/crvoting-utils'

export const reduceDispute = dispute => {
  console.log('before reducing', dispute)
  return {
    ...dispute,
    createdAt: parseInt(dispute.createdAt, 10) * 1000,
    state: DisputesTypes.convertFromString(dispute.state),
    reducedState:
      dispute.state === DisputesTypes.Phase.Ruled
        ? DisputesTypes.Status.Closed
        : DisputesTypes.Status.Open,
    rounds: dispute.rounds.map(round => {
      const { vote, appeal } = round

      return {
        ...round,
        createdAt: parseInt(round.createdAt, 10) * 1000,
        draftTermId: parseInt(round.draftTermId, 10),
        delayedTerms: parseInt(round.delayedTerms, 10),
        number: parseInt(round.number),
        jurors: round.jurors.map(juror => ({
          ...juror,
          weight: parseInt(juror.weight, 10),
        })),
        vote: vote
          ? {
              ...vote,
              winningOutcome: getOutcomeNumber(vote.winningOutcome),
            }
          : null,
        appeal: appeal
          ? {
              ...appeal,
              appealedRuling: parseInt(appeal.appealedRuling, 10),
              opposedRuling: parseInt(appeal.opposedRuling, 10),
            }
          : null,
      }
    }),
  }
}
