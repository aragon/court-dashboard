import { useMemo } from 'react'
import { useSubscription } from 'urql'
import dayjs from 'dayjs'

import { useCourtConfig } from '../providers/CourtConfig'

import { ANJBalance, Juror } from '../queries/balances'
import { CourtConfig } from '../queries/court'
import { AppealsByUser } from '../queries/appeals'
import {
  CurrentTermJurorDrafts,
  SingleDispute,
  AllDisputes,
} from '../queries/disputes'
import { OpenTasks } from '../queries/tasks'

import { transformResponseDisputeAttributes } from '../utils/dispute-utils'
import { bigNum } from '../lib/math-utils'

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

export function useCourtConfigSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfig,
    variables: { id: courtAddress },
  })

  // TODO: handle possible errors
  const { courtConfig } = result.data || {}

  return courtConfig
}

// Single dispute
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

// All disputes
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

export function useJurorDraftsSubscription(jurorId, from, pause) {
  const [result] = useSubscription({
    query: CurrentTermJurorDrafts,
    variables: { id: jurorId, from },
    pause,
  })

  const { juror } = result.data || {}
  return juror && juror.drafts ? juror.drafts : []
}

export function useAppealsByUserSubscription(jurorId, settled) {
  const [result] = useSubscription({
    query: AppealsByUser,
    variables: { id: jurorId, settled },
  })

  const { appeals } = result.data || []

  return appeals
}

export function useTasksSubscription() {
  // 1- Committing, 4-Confirming Appeal , 5- Ended
  const subscriptionVariables = { state: [1, 4] }

  const [{ data, error }] = useSubscription({
    query: OpenTasks,
    variables: subscriptionVariables,
  })

  const tasks = data ? data.adjudicationRounds : []

  return { tasks, error: error }
}
