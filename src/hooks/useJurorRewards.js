import { useMemo } from 'react'
import { useDashboardState } from '../components/Dashboard/DashboardStateProvider'
import { useCourtConfig } from '../providers/CourtConfig'
import { bigNum } from '../lib/math-utils'
import { isJurorCoherent } from '../utils/juror-draft-utils'
import {
  getAppealerFees,
  shouldAppealerBeRewarded,
} from '../utils/appeal-utils'
import { getRoundFees } from '../utils/dispute-utils'
import { useWallet } from '../providers/Wallet'
import { useJurorLastWithdrawalTimeSubscription } from './subscription-hooks'

export default function useJurorRewards() {
  const courtConfig = useCourtConfig()
  const wallet = useWallet()
  const { jurorDrafts, appeals } = useDashboardState()
  const lastWithdrawalTime = useJurorLastWithdrawalTimeSubscription(
    wallet.account
  )

  // For arbitrable and appeal fees we will use a map where map = [disputeId, { amount, rounds }]
  // Where `rounds` is the array of roundIds of non settled rounds
  // This is useful as jurors could have rewards from many rounds for the same dispute
  // which will need to be settled (in case they aren't) before withdrawing them from the treasury
  return useMemo(() => {
    if (!jurorDrafts || !appeals || !lastWithdrawalTime) return null

    // Get ruling and disputes fees
    // Only jurors that voted in consensus with the winning outcome can claim rewards (coherent jurors)
    // We also include already settled rewards which have not been withdrawn from the treasury yet.
    const { rulingFees, arbitrableFees } = jurorDrafts
      .filter(
        jurorDraft =>
          jurorDraft.round.settledPenalties &&
          (!jurorDraft.rewarded ||
            jurorDraft.rewardedAt > lastWithdrawalTime) &&
          isJurorCoherent(jurorDraft)
      )
      .reduce(
        ({ rulingFees, arbitrableFees }, { rewarded, round, weight }) => {
          const { jurorFees, coherentJurors, collectedTokens, dispute } = round

          // Calculate fees
          const rulingFeesAmount = collectedTokens
            .mul(weight)
            .div(coherentJurors)

          const disputeFeesAmount = jurorFees.mul(weight).div(coherentJurors)

          return {
            rulingFees: rulingFees.add(rulingFeesAmount),
            arbitrableFees: setOrUpdateFee(
              arbitrableFees,
              dispute.id,
              round.number,
              disputeFeesAmount,
              rewarded
            ),
          }
        },
        { rulingFees: bigNum(0), arbitrableFees: new Map() }
      )

    // Before settling appeals it's required that the penalties for the round are settled, so we need to filter the ones that aren't
    // We also need to check that the appealer should be rewarded.
    const appealFees = appeals
      .filter(
        appeal =>
          appeal.round.settledPenalties &&
          (!appeal.settled || appeal.settledAt > lastWithdrawalTime) &&
          shouldAppealerBeRewarded(appeal, wallet.account)
      )
      .reduce((appealsFee, appeal) => {
        const { round, settled } = appeal

        // We need to calculate the totalFees of the next round since this amount will be discounted from the appeal reward for the appealer
        const nextRoundId = round.number + 1
        const nextRound = round.dispute.rounds[nextRoundId]

        // It could happen that the appeal is never confirmed. In this case the appealer should get the entire appeal deposit
        const totalFees = nextRound
          ? getRoundFees(nextRound, courtConfig)
          : bigNum(0)

        const appealerFees = getAppealerFees(appeal, totalFees, wallet.account)

        return setOrUpdateFee(
          appealsFee,
          round.dispute.id,
          round.number,
          appealerFees,
          settled
        )
      }, new Map())

    return {
      anjRewards: rulingFees,
      feeRewards: {
        arbitrableFees: feeMapToArray(arbitrableFees),
        appealFees: feeMapToArray(appealFees),
        distribution: getDisputesFeesDistribution(arbitrableFees, appealFees),
      },
    }
  }, [appeals, courtConfig, jurorDrafts, lastWithdrawalTime, wallet])
}

/**
 * Adds or updates a fee entry on the map
 * @param {Map} feeMap Map contianing fee data
 * @param {Number} disputeId Id of the dispute
 * @param {Number} roundId Id of the round
 * @param {BigNum} feeAmount Amount of fees to add to the entry
 * @param {Boolean} settled True if fees for the given round are settled
 * @returns {Map} Updated map with the new entry or the amount updated
 */
function setOrUpdateFee(
  feeMap,
  disputeId,
  roundId,
  feeAmount,
  settled = false
) {
  let feeEntry

  if (feeMap.has(disputeId)) {
    const { amount, rounds, settledAmount } = feeMap.get(disputeId)
    feeEntry = {
      amount: amount.add(feeAmount),
      settledAmount: settled ? settledAmount.add(feeAmount) : settledAmount,
      rounds: [...rounds, ...(settled ? [] : [roundId])],
    }
  } else {
    feeEntry = {
      amount: feeAmount,
      settledAmount: settled ? feeAmount : bigNum(0),
      rounds: settled ? [] : [roundId],
    }
  }

  feeMap.set(disputeId, feeEntry)
  return feeMap
}

/**
 * Creates a new array containing the total amount of fees per dispute
 * @param {Map} artbitrableFeesMap Map of arbitrable fees
 * @param {Map} appealFeesMap Map of appeal fees
 * @returns {Array} New array with the total fees for each dispute
 */

function getDisputesFeesDistribution(artbitrableFeesMap, appealFeesMap) {
  const appealFeesMapCopy = new Map([...appealFeesMap])

  const disputeFees = []
  for (const [disputeId, { amount }] of artbitrableFeesMap.entries()) {
    let totalFeeAmount = amount

    if (appealFeesMapCopy.has(disputeId)) {
      const appealFee = appealFeesMap.get(disputeId)
      totalFeeAmount = totalFeeAmount.add(appealFee.amount)
      appealFeesMapCopy.delete(disputeId)
    }

    disputeFees.push({ disputeId, amount: totalFeeAmount })
  }

  // Add the reaminaing appealing fees in case there wasn't an arbitrable reward in the remaining disputes
  for (const [disputeId, { amount }] of appealFeesMapCopy.entries()) {
    disputeFees.push({ disputeId, amount })
  }

  return disputeFees
}

/**
 * Converts Map into Array
 * @param {Map} feeMap Map to convert to an array
 * @returns {Array} New array containing map data
 */
function feeMapToArray(feeMap) {
  const arr = []
  for (const [disputeId, { rounds, ...feeEntry }] of feeMap) {
    arr.push({
      disputeId,
      ...feeEntry,
      rounds: rounds.sort(),
    })
  }

  return arr
}
