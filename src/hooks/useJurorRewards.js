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

export default function useJurorRewards() {
  const courtConfig = useCourtConfig()
  const wallet = useWallet()
  const { jurorDrafts, appeals } = useDashboardState()

  // For arbitrable and appeal fees we will use a map where map = [disputeId, { amount, rounds }]
  // Where rounds::Set
  // This is useful since it can happen that a juror has rewards from many rounds on the same dispute
  // We also need the data set this way so it's easier to claim rewards later
  return useMemo(() => {
    if (!jurorDrafts || !appeals) return null

    // Get ruling and disputes fees
    // Only jurors that voted in consensus with the winning outcome can claim rewards (coherent jurors)
    const { rulingFees, arbitrableFees } = jurorDrafts
      .filter(
        jurorDraft =>
          jurorDraft.round.settledPenalties && isJurorCoherent(jurorDraft)
      )
      .reduce(
        ({ rulingFees, arbitrableFees }, { weight, round }) => {
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
              disputeFeesAmount
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
          shouldAppealerBeRewarded(appeal, wallet.account)
      )
      .reduce((appealsFee, appeal) => {
        const { round } = appeal

        // We need to calculate the totalFees of the next round since this amount will be discounted from the appeal reward for the appealer
        const nextRoundId = round.number + 1
        const nextRound = round.dispute.rounds[nextRoundId]

        const totalFees = getRoundFees(nextRound, courtConfig)

        const appealerFees = getAppealerFees(appeal, totalFees, wallet.account)

        return setOrUpdateFee(
          appealsFee,
          round.dispute.id,
          round.number,
          appealerFees
        )
      }, new Map())

    return {
      rulingFees,
      arbitrableFees: feeMapToArray(arbitrableFees),
      appealFees: feeMapToArray(appealFees),
      disputesFeesDistribution: getDisputesFeesDistribution(
        arbitrableFees,
        appealFees
      ),
    }
  }, [appeals, wallet, courtConfig, jurorDrafts])
}

/**
 * Adds or updates a fee entry on the map
 * @param {Map} feeMap Map contianing fee data
 * @param {Number} disputeId Id of the dispute
 * @param {Number} roundId Id of the round
 * @param {BigNum} feeAmount Amount of fees to add to the entry
 * @returns {Map} Updated map with the new entry or the amount updated
 */
function setOrUpdateFee(feeMap, disputeId, roundId, feeAmount) {
  if (feeMap.has(disputeId)) {
    const disputeFee = feeMap.get(disputeId)
    const updatedFeeAmount = disputeFee.amount.add(feeAmount)
    feeMap.set(disputeId, {
      rounds: disputeFee.rounds.add(roundId),
      amount: updatedFeeAmount,
    })
  } else {
    feeMap.set(disputeId, {
      amount: feeAmount,
      rounds: new Set([roundId]),
    })
  }

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
    let feeAmount = amount

    if (appealFeesMapCopy.has(disputeId)) {
      const appealFee = appealFeesMap.get(disputeId)
      feeAmount = feeAmount.add(appealFee.amount)
      appealFeesMapCopy.delete(disputeId)
    }

    disputeFees.push({ disputeId, amount: feeAmount })
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
  for (const [disputeId, { amount, rounds }] of feeMap) {
    arr.push({ disputeId, amount, rounds: Array.from(rounds).sort() })
  }

  return arr
}
