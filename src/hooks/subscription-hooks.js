import { useMemo } from 'react'
import { useQuery } from 'urql'
import { useCourtConfig } from '../providers/CourtConfig'

// queries
import { OpenTasks } from '../queries/tasks'
import {
  CourtConfig,
  FeeMovements,
  JurorsRegistryModule,
} from '../queries/court'
import { AllDisputes, SingleDispute } from '../queries/disputes'
import { AppealsByMaker, AppealsByTaker } from '../queries/appeals'
import {
  JurorANJBalances,
  JurorANJWalletBalance,
  JurorTreasuryBalances,
} from '../queries/balances'
import { JurorDraftsFrom, JurorDraftsRewards } from '../queries/jurorDrafts'

// utils
import { bigNum } from '../lib/math-utils'
import { dayjs, toMs } from '../utils/date-utils'
import { groupMovements } from '../utils/anj-movement-utils'
import { transformAppealDataAttributes } from '../utils/appeal-utils'
import {
  transformRoundDataAttributes,
  transformDisputeDataAttributes,
} from '../utils/dispute-utils'
import { transformJurorDataAttributes } from '../utils/juror-draft-utils'
import { transformClaimedFeesDataAttributes } from '../utils/subscription-utils'
import {
  getModuleAddress,
  transformCourtConfigDataAttributes,
} from '../utils/court-utils'

// types
import { CourtModuleType } from '../types/court-module-types'
import { JurorLastFeeWithdrawal } from '../queries/juror'

const NO_AMOUNT = bigNum(0)

function useQuerySub(query, variables = {}, options = {}) {
  return useQuery({
    query: query,
    variables: variables,
    requestPolicy: 'cache-and-network',
    pollInterval: 13 * 1000,
    ...options,
  })
}

// Subscription to get juror's wallet balance
function useANJBalance(jurorId) {
  const [{ data, error }] = useQuerySub(JurorANJWalletBalance, {
    id: jurorId.toLowerCase(),
  })
  return { data, error }
}

// Subscription to get juror's active, inactive and
// locked balances and all 24 hrs movements
function useJuror(jurorId) {
  // get 24hs from current time (seconds)
  const yesterday = dayjs()
    .subtract(1, 'day')
    .unix()

  const [{ data, error }] = useQuerySub(JurorANJBalances, {
    id: jurorId.toLowerCase(),
    from: yesterday,
  })

  return { data, error }
}

// Subscription to get all treasury balances of juror with id `jurorId`
function useJurorTreasuryBalances(jurorId) {
  const [{ data, error }] = useQuerySub(JurorTreasuryBalances, {
    owner: jurorId.toLowerCase(),
  })
  return { data, error }
}

/**
 * Subscribes to all juror balances as well as to the latest 24h movements and all subscription fees claimed by the juror
 * @param {String} jurorId Address of the juror
 * @returns {Object} Object containing al juror balances (Wallet, Inactive, Active, Locked, Deactivation Process, Treasury),
 * latest 24h movements and all subscription fees claimed by the juror
 */
export function useJurorBalancesSubscription(jurorId) {
  // Juror wallet balance
  const { data: anjBalanceData, error: anjBalanceError } = useANJBalance(
    jurorId
  )

  // Juror ANJ balances, 24h movements and subscritpion claimed fees
  const { data: jurorData, error: jurorError } = useJuror(jurorId)
  const {
    data: treasuryBalancesData,
    error: treasuryBalancesError,
  } = useJurorTreasuryBalances(jurorId)

  const errors = [anjBalanceError, jurorError, treasuryBalancesError].filter(
    err => err
  )

  const {
    anjBalances,
    anjMovements,
    claimedSubscriptionFees,
    treasury,
  } = useMemo(() => {
    // Means it's still fetching
    if (!jurorData || !anjBalanceData || !treasuryBalancesData) {
      return {}
    }

    // If the account doesn't hold any ANJ we set 0 as default
    const { amount: walletBalance = NO_AMOUNT } =
      anjBalanceData.anjbalance || {}

    // If the juror is null then means that the connnected account is not a juror but we are already done fetching
    // We set 0 as default values
    const {
      activeBalance = NO_AMOUNT,
      anjMovements = [],
      availableBalance = NO_AMOUNT,
      claimedSubscriptionFees = [],
      deactivationBalance = NO_AMOUNT,
      lockedBalance = NO_AMOUNT,
    } = jurorData.juror || {}

    const { treasuryBalances = [] } = treasuryBalancesData || {}

    return {
      anjBalances: {
        activeBalance: bigNum(activeBalance),
        deactivationBalance: bigNum(deactivationBalance),
        inactiveBalance: bigNum(availableBalance),
        lockedBalance: bigNum(lockedBalance),
        walletBalance: bigNum(walletBalance),
      },
      anjMovements: groupMovements(anjMovements),
      claimedSubscriptionFees: claimedSubscriptionFees.map(
        transformClaimedFeesDataAttributes
      ),
      treasury: treasuryBalances.map(balance => ({
        ...balance,
        amount: bigNum(balance.amount),
      })),
    }
  }, [anjBalanceData, jurorData, treasuryBalancesData])

  return {
    anjBalances,
    anjMovements,
    claimedSubscriptionFees,
    treasury,
    fetching: !anjBalances && errors.length === 0,
    errors,
  }
}

/**
 * Subscribes to the court configuration data
 * @param {String} courtAddress Adrress of the court contract
 * @returns {Object} Court configuration data
 */
export function useCourtConfigSubscription(courtAddress) {
  const [{ data }] = useQuerySub(CourtConfig, {
    id: courtAddress.toLowerCase(),
  })

  // TODO: handle possible errors
  const courtConfig = useMemo(
    () =>
      data?.courtConfig
        ? transformCourtConfigDataAttributes(data.courtConfig)
        : null,
    [data]
  )

  return courtConfig
}

/**
 * Subscribes to the dispute with id == `id`
 * @param {String} id Id of the dispute
 * @returns {Object} Dispute by `id`
 */
export function useSingleDisputeSubscription(id) {
  const [{ data, error }] = useQuerySub(SingleDispute, { id })

  const dispute = useMemo(
    () =>
      data && data.dispute
        ? transformDisputeDataAttributes(data.dispute)
        : null,
    [data]
  )

  return { dispute, fetching: !data && !error, error }
}

/**
 * Subscribes to all existing disputes on the court
 * @returns {Object} All disputes
 */
export function useDisputesSubscription() {
  const courtConfig = useCourtConfig()
  const [{ data, error }] = useQuerySub(AllDisputes)

  const disputes = useMemo(
    () =>
      data?.disputes
        ? data.disputes.map(dispute =>
            transformDisputeDataAttributes(dispute, courtConfig)
          )
        : null,
    [courtConfig, data]
  )

  return { disputes, fetching: !data && !error, error }
}

/**
 * Subscribe to all `jurorId` drafts for the current term
 * @param {String} jurorId Address of the juror
 * @param {Number} termStartTime Start time of the term inseconds
 * @param {Boolean} pause Tells whether to pause the subscription or not
 * @returns {Object} All `jurorId` drafts for the current term
 */
export function useCurrentTermJurorDraftsSubscription(
  jurorId,
  termStartTime,
  pause
) {
  const [result] = useQuerySub(
    JurorDraftsFrom,
    { id: jurorId.toLowerCase(), from: termStartTime },
    { pause }
  )

  const { juror } = result.data || {}
  return juror && juror.drafts ? juror.drafts : []
}

/**
 * Subscribes to all `jurorId` drafts
 * @dev This subscription is useful to get all rewards pending for claiming as well
 * as for the amount of locked ANJ a juror has per dispute
 * Ideally we would check that the round is not settled but we cannot do nested filters for now
 *
 * @param {String} jurorId Address of the juror
 * @returns {Object} All `jurorId` drafts
 */
export function useJurorDraftsRewardsSubscription(jurorId) {
  const [{ data, error }] = useQuerySub(JurorDraftsRewards, {
    id: jurorId.toLowerCase(),
  })

  const jurorDrafts = useMemo(() => {
    if (!data) {
      return null
    }

    return data.juror?.drafts.map(transformJurorDataAttributes) || []
  }, [data])

  return { jurorDrafts, fetching: !jurorDrafts && !error, error }
}

function useAppealsByMaker(jurorId) {
  const [{ data, error }] = useQuerySub(AppealsByMaker, {
    maker: jurorId.toLowerCase(),
  })
  return { data, error }
}

function useAppealsByTaker(jurorId) {
  const [{ data, error }] = useQuerySub(AppealsByTaker, {
    taker: jurorId.toLowerCase(),
  })
  return { data, error }
}

/**
 * Subscribes to all `jurorId` appeal collaterals
 * @dev Since we cannot do or operators on graphql queries, we need to get appeals by taker and maker separately
 *
 * @param {String} jurorId Address of the juror
 * @returns {Object} All `jurorId` appeal collaterals
 */
export function useAppealsByUserSubscription(jurorId) {
  const {
    data: makerAppealsData,
    error: makerAppealsError,
  } = useAppealsByMaker(jurorId)
  const {
    data: takerAppealsData,
    error: takerAppealsError,
  } = useAppealsByTaker(jurorId)

  const appeals = useMemo(() => {
    if (!makerAppealsData || !takerAppealsData) {
      return null
    }

    const makerAppeals = makerAppealsData.appeals
    const takerAppeals = takerAppealsData.appeals

    return [...makerAppeals, ...takerAppeals].map(transformAppealDataAttributes)
  }, [makerAppealsData, takerAppealsData])

  const errors = [makerAppealsError, takerAppealsError].filter(err => err)

  return { appeals, fetching: !appeals && errors.length === 0, errors }
}

export function useTasksSubscription() {
  // 1- Committing, 4-Confirming Appeal , 5- Ended
  const subscriptionVariables = { state: [1, 4] }

  const [{ data, error }] = useQuerySub(OpenTasks, subscriptionVariables)

  const tasks =
    data?.adjudicationRounds.map(transformRoundDataAttributes) || null

  return { tasks, fetching: !data && !error, error }
}

export function useJurorRegistrySubscription() {
  const { modules } = useCourtConfig()
  const jurorRegistryAddress = getModuleAddress(
    modules,
    CourtModuleType.JurorsRegistry
  )

  const [{ data, error }] = useQuerySub(JurorsRegistryModule, {
    id: jurorRegistryAddress,
  })

  const jurorRegistryStats = data?.jurorsRegistryModule || null

  return { data: jurorRegistryStats, error }
}

export function useTotalRewardsSubscription() {
  const [{ data, error }] = useQuerySub(FeeMovements)

  const rewards = data?.feeMovements || null

  return { data: rewards, error }
}

/**
 * Queries for the last withdrawal fee movement time made by the given juror
 * @param {String} jurorId Address of the juror
 * @returns {Number} Juror's last withdrawal fee movement date in unix time
 */
export function useJurorLastWithdrawalTimeSubscription(jurorId) {
  const [{ data }] = useQuerySub(
    JurorLastFeeWithdrawal,
    { owner: jurorId?.toLowerCase() },
    { pause: !jurorId }
  )

  if (!data) {
    return null
  }

  if (data.feeMovements.length === 0) {
    return -1
  }

  return toMs(data.feeMovements[0].createdAt)
}
