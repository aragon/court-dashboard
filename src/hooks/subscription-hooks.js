import { useSubscription } from 'urql'
import dayjs from 'dayjs'

import { ANJBalance, Juror } from '../queries/balances'
import { CourtConfig } from '../queries/court'

import { bigNum } from '../lib/math-utils'
import { AppealsByUser } from '../queries/appeals'

const NO_AMOUNT = bigNum(0)

function useANJBalance(jurorId) {
  const [result] = useSubscription({
    skip: true,
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

export function useAppealsByUser(jurorId, settled) {
  const [result] = useSubscription({
    query: AppealsByUser,
    variables: { id: jurorId, settled },
  })

  const { appeals } = result.data || []

  return appeals
}
