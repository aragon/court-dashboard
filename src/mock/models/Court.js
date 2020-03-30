import Jurors from '../data/Jurors'
import Disputes from '../data/Disputes'
import courtConfig from '../data/CourtConfig'
import { JurorRegistry } from '../data/Modules'

import { bigNum } from '../../lib/math-utils'
import { dayjs } from '../../utils/date-utils'
import { addressesEqual } from '../../lib/web3-utils'
import {
  accounts,
  bigExp,
  getDraftTermId,
  getMinActiveBalanceMultiple,
  getRandomNumber,
  pct,
} from '../helper'
import {
  ANJMovementType,
  AdjudicationState,
  DisputeState,
  RulingOptions,
  getAdjudicationStateNumber,
  getRulingOptionNumber,
} from '../types'

const DEFAULT_APPEAL_MAKER = accounts[0]
const DEFAULT_APPEAL_TAKER = accounts[1]
const DEFAULT_APPEAL_DEPOSIT = bigExp('185')
const DEFAULT_CONFIRM_APPEAL_DEPOSIT = bigExp('225')

export default class {
  constructor() {
    this.config = courtConfig
    this.jurorsRegistryModule = JurorRegistry

    this.disputes = Disputes
    this.jurors = Jurors
    this.appeals = []
    this.adjudicationRounds = []
    this.updateTotalActiveBalance()

    this.draftJurors()
    this.createVotes()
    this.createAppeals()
  }

  getDispute(id) {
    return this.disputes.find(dispute => dispute.id === id)
  }

  getJuror(id) {
    return this.jurors.find(juror => addressesEqual(juror.id, id))
  }

  getAppealsByMaker(maker) {
    return this.appeals.filter(appeal => addressesEqual(appeal.maker, maker))
  }

  getAppealsByTaker(taker) {
    return this.appeals.filter(appeal => addressesEqual(appeal.taker, taker))
  }

  getRoundsByState(state) {
    return this.adjudicationRounds.filter(round =>
      state.includes(getAdjudicationStateNumber(round.state))
    )
  }

  draftJurors() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]
      // We will only "draft" jurors for last round since we don't really care for previous rounds data
      const lastRoundId = dispute.rounds.length - 1
      const lastRound = dispute.rounds[lastRoundId]

      if (lastRound.state === AdjudicationState.Invalid) {
        continue
      }

      this.adjudicationRounds.push(lastRound)

      lastRound.jurors = []
      lastRound.draftTermId = getDraftTermId(lastRound.state, this.config)
      const maxRegularAppealRoundsReached =
        this.config.maxRegularAppealRounds <= lastRoundId

      // If we reached the last possible round, juror's weight is relative to the number of times the min active balance the juror has
      if (maxRegularAppealRoundsReached) {
        // final round

        lastRound.jurorsNumber = getMinActiveBalanceMultiple(
          bigNum(this.jurorsRegistryModule.totalActive),
          bigNum(this.config.minActiveBalance)
        )
      } else {
        // normal round
        let selectedJurors = 0
        const jurorsNumber = lastRound.jurorsNumber
        while (selectedJurors < jurorsNumber) {
          // We select a juror betwwen the 3 available accounts

          const selectedAccountIndex = getRandomNumber(0, accounts.length - 1)
          const selectedAccount = accounts[selectedAccountIndex]

          const selectedJuror = this.getJuror(selectedAccount)

          const draftLockAmount = pct(
            bigNum(this.config.minActiveBalance),
            this.config.penaltyPct
          )

          const jurorDraft = lastRound.jurors.find(jurorDraft =>
            addressesEqual(jurorDraft.juror.id, selectedAccount)
          )

          if (!jurorDraft) {
            this.createDraft(selectedJuror, lastRound, 1, draftLockAmount)
          } else {
            jurorDraft.weight += 1

            this.lockAnjAmount(selectedJuror, draftLockAmount)
          }

          selectedJurors += 1
        }
      }
    }
  }

  createDraft(juror, round, weight, draftLockAmount) {
    const jurorDraft = {
      id: '0x',
      round,
      juror,
      weight,
    }

    this.lockAnjAmount(juror, draftLockAmount)

    // Associate respective entities.
    juror.drafts.push(jurorDraft)
    round.jurors.push(jurorDraft)
  }

  lockAnjAmount(juror, amount) {
    if (amount.gt(0)) {
      // Create lock anjMovement
      juror.anjMovements = [
        {
          amount: amount.toString(),
          effectiveTermId: null,
          createdAt: dayjs().unix(),
          type: ANJMovementType.Lock,
        },
        ...juror.anjMovements,
      ]

      // Update juror locked balance
      juror.lockedBalance = bigNum(juror.lockedBalance)
        .add(amount)
        .toString()
    }
  }

  createVotes() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]

      if (!dispute.flagData?.vote) {
        if (dispute.state === DisputeState.Ruled) {
          dispute.finalRuling = getRulingOptionNumber(RulingOptions.Refused)
        }

        continue
      }

      // We will only create votes for last round since we don't really care for previous rounds data
      const lastRoundId = dispute.rounds.length - 1
      const lastRound = dispute.rounds[lastRoundId]
      const maxRegularAppealRoundsReached =
        this.config.maxRegularAppealRounds <= lastRoundId

      if (maxRegularAppealRoundsReached) {
        const selectedJurors = this.jurors.filter(juror =>
          bigNum(juror.activeBalance).gt(this.config.minActiveBalance)
        )

        selectedJurors.forEach(juror => {
          const jurorWeight = getMinActiveBalanceMultiple(
            bigNum(juror.activeBalance),
            bigNum(this.config.minActiveBalance)
          )

          this.createDraft(juror, lastRound, jurorWeight, bigNum(0))

          const weightedPenalty = pct(
            bigNum(juror.activeBalance),
            bigNum(this.config.penaltyPct)
          )

          this.slashJuror(juror, weightedPenalty)
        })
      }

      const voteMetadata = dispute.flagData.vote
      for (let j = 0; j < lastRound.jurors.length; j++) {
        const draft = lastRound.jurors[j]
        draft.commitment = '0x'
        draft.commitmentDate = 0

        draft.outcome = getRulingOptionNumber(voteMetadata.winningOutcome)
        draft.revealDate = dayjs().unix()
      }

      lastRound.vote = {
        winningOutcome: voteMetadata.winningOutcome,
      }

      if (lastRound.state === AdjudicationState.Ended) {
        dispute.finalRuling = getRulingOptionNumber(voteMetadata.winningOutcome)
      }
    }
  }

  slashJuror(juror, amount) {
    juror.activeBalance = bigNum(juror.activeBalance).sub(amount)

    juror.anjMovements.unshift({
      amount: amount.toString(),
      effectiveTermId: null,
      createdAt: dayjs().unix(),
      type: ANJMovementType.Slash,
    })
  }

  createAppeals() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]

      if (!dispute.flagData?.appeal) {
        continue
      }

      const appealMetaData = dispute.flagData.appeal

      const lastRoundId = dispute.rounds.length - 1
      const lastRound = dispute.rounds[lastRoundId]

      const appeal = {
        id: '',

        round: {
          number: lastRound.number,
          settledPenalties: lastRound.settledPenalties,
          dispute: {
            id: dispute.id,
            finalRuling: dispute.finalRuling,
            lastRoundId: dispute.lastRoundId,
            rounds: dispute.rounds.map(round => ({
              jurorsNumber: round.jurorsNumber,
              number: round.number,
            })),
          },
        },

        maker: DEFAULT_APPEAL_MAKER,
        appealedRuling: getRulingOptionNumber(appealMetaData.appealedRuling),
        appealDeposit: DEFAULT_APPEAL_DEPOSIT,
        createdAt: dayjs().unix(),

        ...(appealMetaData.opposedRuling
          ? {
              opposedRuling: getRulingOptionNumber(
                appealMetaData.opposedRuling
              ),
              confirmedAt: appealMetaData.opposedRuling ? dayjs().unix() : null,
              confirmAppealDeposit: DEFAULT_CONFIRM_APPEAL_DEPOSIT,
              taker: appealMetaData.opposedRuling ? DEFAULT_APPEAL_TAKER : null,
            }
          : {
              confirmAppealDeposit: '0',
            }),
      }
      lastRound.appeal = appeal

      // Save appeal to collection
      this.appeals.push(appeal)
    }
  }

  updateTotalActiveBalance() {
    this.jurorsRegistryModule.totalActive = String(
      this.jurors.reduce(
        (acc, juror) => acc.add(juror.activeBalance),
        bigNum(0)
      )
    )
  }
}

/// // Juror draft not rewarded Example////
// juror: {
//   id: '',
//   drafts: [
//     {
//       weight: 3,
//       outcome: 4,
//       round: {
//         number: '1',
//         coherentJurors: '1',
//         collectedTokens: bigExp('20'),
//         jurorFees: bigExp('10'),
//         settledPenalties: true,
//         dispute: {
//           id: '1',
//           finalRuling: 4,
//         },
//       },
//     },
//   ],
// },
