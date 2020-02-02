import { useMemo } from 'react'
import { useSubscription } from 'urql'
import dayjs from 'dayjs'

import { bigNum } from '../lib/math-utils'
import { transformResponseDisputeAttributes } from '../utils/dispute-utils'

import { ANJBalance, Juror } from '../queries/balances'
import { CourtConfig } from '../queries/court'
import { AppealsByMaker, AppealsByTaker } from '../queries/appeals'
import {
  CurrentTermJurorDrafts,
  AllDisputes,
  SingleDispute,
} from '../queries/disputes'
import { OpenTasks } from '../queries/tasks'

import { useCourtConfig } from '../providers/CourtConfig'

const NO_AMOUNT = bigNum(0)

function useANJBalance(jurorId) {
  const [result] = useSubscription({
    query: ANJBalance,
    variables: { id: jurorId },
  })
  const data = result.data ? result.data.anjbalance : undefined

  return { ...result, data }
}

function useJuror(jurorId) {
  // get 24hs from current time (seconds)
  const yesterday = dayjs()
    .subtract(1, 'day')
    .unix()

  const [result] = useSubscription({
    query: Juror,
    variables: { id: jurorId, from: yesterday },
  })

  const data = result.data ? result.data.juror : undefined
  return { ...result, data }
}

export function useJurorBalancesSubscription(jurorId) {
  // My wallet balance
  const {
    data: anjBalanceData,
    error: anjBalanceError,
    fetching: anjBalanceFetching,
  } = useANJBalance(jurorId)

  // Active, inactive, locked balance
  const {
    data: jurorData,
    error: jurorError,
    fetching: jurorFetching,
  } = useJuror(jurorId)

  const fetching = anjBalanceFetching || jurorFetching
  const errors = [anjBalanceError, jurorError].filter(err => err)

  const { amount: walletBalance = NO_AMOUNT } = anjBalanceData || {}
  const {
    activeBalance = NO_AMOUNT,
    lockedBalance = NO_AMOUNT,
    availableBalance = NO_AMOUNT,
    deactivationBalance = NO_AMOUNT,
    movements = [],
  } = jurorData || {}

  const balances = {
    walletBalance: bigNum(walletBalance),
    activeBalance: bigNum(activeBalance),
    lockedBalance: bigNum(lockedBalance),
    inactiveBalance: bigNum(availableBalance),
    deactivationBalance: bigNum(deactivationBalance),
  }

  return {
    balances,
    fetching,
    errors,
    movements: movements.map(movement => ({
      ...movement,
      effectiveTermId: parseInt(movement.effectiveTermId, 10),
      amount: bigNum(movement.amount),
    })),
  }
}

// Court config
export function useCourtSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfig,
    variables: { id: courtAddress },
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

  return courtConfig
}

// Single dispute
export default function useSingleDisputeSubscription(id) {
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

// All disputes
export function useDisputesSubscription() {
  const courtConfig = useCourtConfig()
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return response.disputes.map(dispute =>
      transformResponseDisputeAttributes(dispute, courtConfig)
    )
  }

  const [result] = useSubscription(
    {
      query: AllDisputes,
    },
    handleSubscription
  )
  const disputes = result.data || []

  return { disputes, errors: result.errors, fetching: result.fetching }
}

export function useTasksSubscription() {
  // 1- Committing, 4-Confirming Appeal , 5- Ended
  const subscriptionVariables = { state: [1, 4] }

  const [{ data, error }] = useSubscription({
    query: OpenTasks,
    variables: subscriptionVariables,
  })

  const tasks = data ? data.adjudicationRounds : []

  return { tasks, errors: error }
}

export function useCourtConfigSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfig,
    variables: { id: courtAddress },
  })

  // TODO: handle possible errors
  const { courtConfig } = result.data || {}

  return courtConfig
}

export function useJurorDraftsSubscription(jurorId, from, pause) {
  const [result] = useSubscription({
    query: CurrentTermJurorDrafts,
    variables: { id: jurorId, from },
    pause,
  })

  const { juror } = result.data || {}
  return juror && juror.drafts ? juror.drafts : []
}

function useAppealsByMaker(jurorId, settled) {
  const [{ data, error }] = useSubscription({
    query: AppealsByMaker,
    variables: { maker: jurorId, settled },
  })

  return { data, error }
}

function useAppealsByTaker(jurorId, settled) {
  const [{ data, error }] = useSubscription({
    query: AppealsByTaker,
    variables: { taker: jurorId, settled },
  })

  return { data, error }
}

// Since we cannot do or operators on graphql queries, we need to get appeals by taker and maker separately
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

    return [...makerAppeals, ...takerAppeals].map(
      ({ round, maker, taker, ...appeal }) => ({
        disputeId: round.dispute.id,
        amountStaked: bigNum(
          maker ? appeal.appealDeposit : appeal.confirmAppealDeposit
        ),
      })
    )
  }, [makerAppealsData, takerAppealsData])

  const errors = [makerAppealsError, takerAppealsError].filter(err => err)

  return { appeals, fetching: !appeals && errors.legnth === 0, errors }
}
