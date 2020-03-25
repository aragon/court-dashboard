import { useMemo } from 'react'
import { useSubscription } from 'urql'
import { dayjs } from '../utils/date-utils'
import { CourtModuleType } from '../types/court-module-types'
import { useCourtConfig } from '../providers/CourtConfig'
import { ANJBalance, Juror } from '../queries/balances'
import {
  CourtConfig,
  JurorsRegistryModule,
  FeeMovements,
} from '../queries/court'
import { AppealsByMaker, AppealsByTaker } from '../queries/appeals'
import {
  JurorDraftsNotRewarded,
  CurrentTermJurorDrafts,
} from '../queries/jurorDrafts'
import { SingleDispute, AllDisputes } from '../queries/disputes'
import { OpenTasks } from '../queries/tasks'
import { transformResponseDisputeAttributes } from '../utils/dispute-utils'
import { bigNum } from '../lib/math-utils'
import { transformJurorDataAttributes } from '../utils/juror-draft-utils'
import { transformAppealDataAttributes } from '../utils/appeal-utils'
import { groupMovements } from '../utils/anj-movement-utils'
import { getModuleAddress } from '../utils/court-utils'

const NO_AMOUNT = bigNum(0)

// Subscription to get juror's wallet balance
function useANJBalance(jurorId) {
  const [{ data, error }] = useSubscription({
    query: ANJBalance,
    variables: { id: jurorId.toLowerCase() },
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

  const [{ data, error }] = useSubscription({
    query: Juror,
    variables: { id: jurorId.toLowerCase(), from: yesterday },
  })

  return { data, error }
}

/**
 * Subscribes to all juror balances as well as to the latest 24h movements
 * @param {String} jurorId Address of the juror
 * @returns {Object} Object containing al juror balances (Wallet, Inactive, Active, Locked, Deactivation Process)
 * and latest 24h movements
 */
export function useJurorBalancesSubscription(jurorId) {
  // My wallet balance
  const { data: anjBalanceData, error: anjBalanceError } = useANJBalance(
    jurorId
  )

  // Active, inactive, locked balance
  const { data: jurorData, error: jurorError } = useJuror(jurorId)

  const errors = [anjBalanceError, jurorError].filter(err => err)

  const { balances, anjMovements, treasury } = useMemo(() => {
    // Means it's still fetching
    if (!jurorData || !anjBalanceData) {
      return {}
    }

    // If the account doesn't hold any ANJ we set 0 as default
    const { amount: walletBalance = NO_AMOUNT } =
      anjBalanceData.anjbalance || {}

    // If the juror is null then means that the connnected account is not a juror but we are already done fetching
    // We set 0 as default values
    const {
      activeBalance = NO_AMOUNT,
      availableBalance = NO_AMOUNT,
      deactivationBalance = NO_AMOUNT,
      lockedBalance = NO_AMOUNT,
      anjMovements = [],
      treasuryBalances = [],
    } = jurorData.juror || {}

    return {
      balances: {
        walletBalance: bigNum(walletBalance),
        activeBalance: bigNum(activeBalance),
        lockedBalance: bigNum(lockedBalance),
        inactiveBalance: bigNum(availableBalance),
        deactivationBalance: bigNum(deactivationBalance),
      },
      anjMovements: groupMovements(anjMovements),
      treasury: treasuryBalances.map(treasuryBalance => ({
        ...treasuryBalance,
        amount: bigNum(treasuryBalance.amount),
      })),
    }
  }, [anjBalanceData, jurorData])

  return {
    balances,
    anjMovements,
    treasury,
    fetching: !balances && errors.length === 0,
    errors,
  }
}

/**
 * Subscribes to the court configuration data
 * @param {String} courtAddress Adrress of the court contract
 * @returns {Object} Court configuration data
 */
export function useCourtConfigSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfig,
    variables: { id: courtAddress.toLowerCase() },
  })

  // TODO: handle possible errors
  const { courtConfig } = result.data || {}

  return courtConfig
}

/**
 * Subscribes to the dispute with id == `id`
 * @param {String} id Id of the dispute
 * @returns {Object} Dispute by `id`
 */
export function useSingleDisputeSubscription(id) {
  const [{ data, error }] = useSubscription({
    query: SingleDispute,
    variables: { id },
  })

  const dispute = useMemo(
    () =>
      data && data.dispute
        ? transformResponseDisputeAttributes(data.dispute)
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

  const [{ data, error }] = useSubscription({
    query: AllDisputes,
  })

  const disputes = useMemo(
    () =>
      data && data.disputes
        ? data.disputes.map(dispute =>
            transformResponseDisputeAttributes(dispute, courtConfig)
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
  const [result] = useSubscription({
    query: CurrentTermJurorDrafts,
    variables: { id: jurorId.toLowerCase(), from: termStartTime },
    pause,
  })

  const { juror } = result.data || {}
  return juror && juror.drafts ? juror.drafts : []
}

/**
 * Subscribes to all `jurorId` drafts that are not yet rewarded
 * @dev This subscription is useful to get all rewards pending for claiming as well
 * as for the amount of locked ANJ a juror has per dispute
 * Ideally we would check that the round is not settled but we cannot do nested filters for now
 *
 * @param {String} jurorId Address of the juror
 * @returns {Object} All `jurorId` drafts not yet rewarded
 */
export function useJurorDraftsNotRewardedSubscription(jurorId) {
  const [{ data, error }] = useSubscription({
    query: JurorDraftsNotRewarded,
    variables: { id: jurorId.toLowerCase() },
  })

  const jurorDrafts = useMemo(() => {
    if (!data) {
      return null
    }

    return data.juror ? data.juror.drafts.map(transformJurorDataAttributes) : []
  }, [data])

  return { jurorDrafts, fetching: !jurorDrafts && !error, error }
}

function useAppealsByMaker(jurorId, settled) {
  const [{ data, error }] = useSubscription({
    query: AppealsByMaker,
    variables: { maker: jurorId.toLowerCase(), settled },
  })

  return { data, error }
}

function useAppealsByTaker(jurorId, settled) {
  const [{ data, error }] = useSubscription({
    query: AppealsByTaker,
    variables: { taker: jurorId.toLowerCase(), settled },
  })

  return { data, error }
}

/**
 * Subscribes to all `jurorId` appeal collaterals that are `!settled ? 'not': ''` settled
 * @dev Since we cannot do or operators on graphql queries, we need to get appeals by taker and maker separately
 *
 * @param {String} jurorId Address of the juror
 * @param {Boolean} settled Tells if appeals should be settled or not
 * @returns {Object} All current `jurorId` appeal collaterals
 */
export function useAppealsByUserSubscription(jurorId, settled) {
  const {
    data: makerAppealsData,
    error: makerAppealsError,
  } = useAppealsByMaker(jurorId, settled)
  const {
    data: takerAppealsData,
    error: takerAppealsError,
  } = useAppealsByTaker(jurorId, settled)

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

  const [{ data, error }] = useSubscription({
    query: OpenTasks,
    variables: subscriptionVariables,
  })

  const tasks = data?.adjudicationRounds || null

  return { tasks, fetching: !data && !error, error }
}

export function useJurorRegistrySubscription() {
  const { modules } = useCourtConfig()
  const jurorRegistryAddress = getModuleAddress(
    modules,
    CourtModuleType.JurorsRegistry
  )

  const [{ data, error }] = useSubscription({
    query: JurorsRegistryModule,
    variables: { id: jurorRegistryAddress },
  })

  const juroRegistryStats = data?.jurorsRegistryModule || null

  return { data: juroRegistryStats, error }
}

export function useTotalRewardsSubscription() {
  const [{ data, error }] = useSubscription({
    query: FeeMovements,
  })

  const rewards = data?.feeMovements || null

  return { data: rewards, error }
}
