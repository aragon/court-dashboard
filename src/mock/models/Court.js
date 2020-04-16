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
  getTermStartTime,
} from '../helper'
import {
  ANJMovementType,
  AdjudicationState,
  DisputeState,
  RulingOptions,
  getAdjudicationStateNumber,
  getRulingOptionNumber,
} from '../types'

const DEFAULT_APPEAL_MAKER = accounts[4]
const DEFAULT_APPEAL_TAKER = accounts[5]
const DEFAULT_APPEAL_DEPOSIT = bigExp('185')
const DEFAULT_CONFIRM_APPEAL_DEPOSIT = bigExp('225')

export default class Court {
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
    this.settlePenalties()
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
    return this.adjudicationRounds.filter(round => {
      const adjudicationState = getAdjudicationStateNumber(round.state)
      return state[0] <= adjudicationState && adjudicationState <= state[1]
    })
  }

  // Randomly draft the 3 possible jurors.
  draftJurors() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]

      // Draft jurors for each round
      for (let roundId = 0; roundId < dispute.rounds.length; roundId++) {
        const round = dispute.rounds[roundId]

        round.draftTermId = getDraftTermId(round.state, this.config)
        round.jurors = []

        this.adjudicationRounds.push(round)

        if (round.state === AdjudicationState.Invalid) {
          continue
        }

        const maxRegularAppealRoundsReached =
          this.config.maxRegularAppealRounds <= roundId

        // If we reached the last possible round, juror's weight is relative to the number of times the min active balance the juror has
        if (maxRegularAppealRoundsReached) {
          // final round

          round.jurorsNumber = getMinActiveBalanceMultiple(
            bigNum(this.jurorsRegistryModule.totalActive),
            bigNum(this.config.minActiveBalance)
          )
        } else {
          // normal round
          let selectedJurors = 0
          const jurorsNumber = round.jurorsNumber
          while (selectedJurors < jurorsNumber) {
            // Select a juror
            const selectedJurorIndex = getRandomNumber(
              0,
              this.jurors.length - 2
            )
            const selectedJuror = this.jurors[selectedJurorIndex]

            const draftLockAmount = pct(
              bigNum(this.config.minActiveBalance),
              this.config.penaltyPct
            )

            const jurorDraft = round.jurors.find(jurorDraft =>
              addressesEqual(jurorDraft.juror.id, selectedJuror.id)
            )

            if (!jurorDraft) {
              this.createDraft(selectedJuror, round, 1, draftLockAmount)
            } else {
              jurorDraft.weight += 1

              this.lockAnjAmount(selectedJuror, draftLockAmount)
            }

            selectedJurors += 1
          }

          round.jurorFees = bigNum(this.config.jurorFee).mul(selectedJurors)
          round.selectedJurors = selectedJurors
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
      createdAt: getTermStartTime(round.draftTermId, this.config),
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

  // Create votes for each round flagged with `voteData`
  createVotes() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]

      if (dispute.state === DisputeState.Ruled) {
        dispute.finalRuling = getRulingOptionNumber(RulingOptions.Refused)
      }

      // Create votes for each round
      for (let roundId = 0; roundId < dispute.rounds.length; roundId++) {
        const round = dispute.rounds[roundId]

        // voteData tells whether we should create votes for the dispute in question
        if (!round.voteData) {
          continue
        }

        const maxRegularAppealRoundsReached =
          this.config.maxRegularAppealRounds <= roundId

        // If we are at the final round, we preslash jurors
        if (maxRegularAppealRoundsReached) {
          const selectedJurors = this.jurors.filter(juror =>
            bigNum(juror.activeBalance).gt(this.config.minActiveBalance)
          )

          selectedJurors.forEach(juror => {
            const jurorWeight = getMinActiveBalanceMultiple(
              bigNum(juror.activeBalance),
              bigNum(this.config.minActiveBalance)
            )

            this.createDraft(juror, round, jurorWeight, bigNum(0))

            const weightedPenalty = pct(
              bigNum(juror.activeBalance),
              bigNum(this.config.penaltyPct)
            )

            this.collectTokens(juror, round, weightedPenalty, false)
          })
        }

        const { voteData } = round

        let processedWeight = 0
        const jurorsNumber = round.jurorsNumber
        for (let j = 0; j < round.jurors.length; j++) {
          const draft = round.jurors[j]
          draft.commitment = '0x'
          draft.commitmentDate = dayjs().unix()

          if (voteData.onlyCommit) {
            continue
          }

          const mayorityEnsured = processedWeight > jurorsNumber / 2

          // If possible we'll try to ditribute the total votes
          // `winningOutcome` has the ruling option that should have the mayority of votes
          // `minority` has the ruling option that should have the minority
          // TODO: Add cases to distribute votes among the 3 ruling options
          draft.revealDate = dayjs().unix()
          draft.outcome = getRulingOptionNumber(
            voteData[
              mayorityEnsured && voteData.minority
                ? 'minority'
                : 'winningOutcome'
            ]
          )

          processedWeight += draft.weight
        }

        round.vote = {
          winningOutcome: voteData.winningOutcome,
        }

        if (round.state === AdjudicationState.Ended) {
          dispute.finalRuling = getRulingOptionNumber(voteData.winningOutcome)
        }
      }
    }
  }

  // Create appeals for each round flagged with `appealData`
  createAppeals() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]

      for (let roundId = 0; roundId < dispute.rounds.length; roundId++) {
        const round = dispute.rounds[roundId]

        // `appealData` tells whether we should create appeals for the dispute in question
        if (!round.appealData) {
          continue
        }

        const { appealData } = round

        const appeal = {
          round,
          appealedRuling: getRulingOptionNumber(appealData.appealedRuling),
          maker: DEFAULT_APPEAL_MAKER,
          appealDeposit: DEFAULT_APPEAL_DEPOSIT,
          createdAt: dayjs().unix(),

          ...(appealData.opposedRuling
            ? {
                opposedRuling: getRulingOptionNumber(appealData.opposedRuling),
                taker: DEFAULT_APPEAL_TAKER,
                confirmAppealDeposit: DEFAULT_CONFIRM_APPEAL_DEPOSIT,
                confirmedAt: dayjs().unix(),
              }
            : {
                confirmAppealDeposit: '0',
              }),
        }

        // Save appeal round reference
        round.appeal = appeal

        // Save appeal to collection
        this.appeals.push(appeal)
      }
    }
  }

  // Settle penalties for each round that is flagged with `settlePenalties` prop
  settlePenalties() {
    for (let i = 0; i < this.disputes.length; i++) {
      const dispute = this.disputes[i]

      for (let roundId = 0; roundId < dispute.rounds.length; roundId++) {
        const round = dispute.rounds[roundId]

        if (!round.settlePenalties) {
          continue
        }

        const maxRegularAppealRoundsReached =
          this.config.maxRegularAppealRounds <= roundId

        if (!maxRegularAppealRoundsReached) {
          for (let i = 0; i < round.jurors.length; i++) {
            const jurorDraft = round.jurors[i]

            const isCoherentJuror = jurorDraft.outcome === dispute.finalRuling

            const slashOrUnlockAmount = pct(
              bigNum(this.config.minActiveBalance),
              this.config.penaltyPct
            )
            const draftLockAmountTotal = slashOrUnlockAmount.mul(
              jurorDraft.weight
            )

            if (isCoherentJuror) {
              // unlock juror ANJ if juror is coherent
              round.coherentJurors += jurorDraft.weight
              this.unlockJurorANJ(jurorDraft.juror, draftLockAmountTotal)
            } else {
              this.collectTokens(
                jurorDraft.juror,
                round,
                draftLockAmountTotal,
                true
              )
            }
          }
        }

        round.settledPenalties = true
      }
    }
  }

  slashJuror(juror, amount) {
    juror.activeBalance = bigNum(juror.activeBalance).sub(amount)

    this.jurorsRegistryModule.totalActive = bigNum(
      this.jurorsRegistryModule.totalActive
    ).sub(amount)

    juror.anjMovements.unshift({
      amount: amount.toString(),
      effectiveTermId: null,
      createdAt: dayjs().unix(),
      type: ANJMovementType.Slash,
    })
  }

  unlockJurorANJ(juror, amount) {
    this.updateJurorLockedBalance(juror, amount)

    juror.anjMovements.unshift({
      amount: amount.toString(),
      effectiveTermId: null,
      createdAt: dayjs().unix(),
      type: ANJMovementType.Unlock,
    })
  }

  collectTokens(juror, round, amount, unlockBalance) {
    // collect tokens if juror didn't vote for the winning outcome
    round.collectedTokens = bigNum(round.collectedTokens)
      .add(amount)
      .toString()

    this.slashJuror(juror, amount)

    if (unlockBalance) {
      this.updateJurorLockedBalance(juror, amount)
    }
  }

  updateJurorLockedBalance(juror, amount) {
    juror.lockedBalance = bigNum(juror.lockedBalance).sub(amount)
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
