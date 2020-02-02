import { useMemo } from 'react'
import { useSubscription } from 'urql'
import dayjs from 'dayjs'

import { ANJBalance, Juror } from '../queries/balances'
import { CourtConfig } from '../queries/court'

import { bigNum } from '../lib/math-utils'
import { AppealsByUser } from '../queries/appeals'
import { CurrentTermJurorDrafts } from '../queries/disputes'

const NO_AMOUNT = bigNum(0)

// Subscription to get juror's wallet balance
function useANJBalance(jurorId) {
  const [{ data, error }] = useSubscription({
    query: ANJBalance,
    variables: { id: jurorId },
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
    variables: { id: jurorId, from: yesterday },
  })

  return { data, error }
}

export function useJurorBalancesSubscription(jurorId) {
  // My wallet balance
  const { data: anjBalanceData, error: anjBalanceError } = useANJBalance(
    jurorId
  )

  // Active, inactive, locked balance
  const { data: jurorData, error: jurorError } = useJuror(jurorId)

  const errors = [anjBalanceError, jurorError].filter(err => err)

  const { balances, movements } = useMemo(() => {
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
      lockedBalance = NO_AMOUNT,
      availableBalance = NO_AMOUNT,
      deactivationBalance = NO_AMOUNT,
      movements = [],
    } = jurorData.juror || {}

    return {
      balances: {
        walletBalance: bigNum(walletBalance),
        activeBalance: bigNum(activeBalance),
        lockedBalance: bigNum(lockedBalance),
        inactiveBalance: bigNum(availableBalance),
        deactivationBalance: bigNum(deactivationBalance),
      },
      movements: movements.map(movement => ({
        ...movement,
        effectiveTermId: parseInt(movement.effectiveTermId, 10),
        amount: bigNum(movement.amount),
      })),
    }
  }, [anjBalanceData, jurorData])

  return {
    balances,
    movements,
    fetching: !balances && errors.length === 0,
    errors,
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
