import { useSubscription } from 'urql'
import dayjs from 'dayjs'

import { ANJBalance, Juror } from '../queries/balances'
import { CourtConfig } from '../queries/court'

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
  } = useANJBalance(jurorId.toLowerCase())

  // Active, inactive balance
  const {
    data: jurorData,
    error: jurorError,
    fetching: jurorFetching,
  } = useJuror(jurorId.toLowerCase())

  const fetching = anjBalanceFetching || jurorFetching
  const errors = [anjBalanceError, jurorError].filter(err => err)

  const balances = {
    // TODO: find cleaner way
    walletBalance: anjBalanceData ? bigNum(anjBalanceData.amount) : NO_AMOUNT,
    activeBalance: jurorData ? bigNum(jurorData.activeBalance) : NO_AMOUNT,
    lockedBalance: jurorData ? bigNum(jurorData.lockedBalance) : NO_AMOUNT,
    inactiveBalance: jurorData ? bigNum(jurorData.availableBalance) : NO_AMOUNT,
    deactivationBalance: jurorData
      ? bigNum(jurorData.deactivationBalance)
      : NO_AMOUNT,
  }

  const movements = jurorData
    ? jurorData.movements.map(movement => ({
        ...movement,
        amount: bigNum(movement.amount),
      }))
    : []

  return { balances, movements, fetching, errors }
}

export function useCourtSubscription(courtAddress) {
  const [result] = useSubscription({
    query: CourtConfig,
    variables: { id: courtAddress },
  })

  // TODO: handle possible errors
  const courtConfig = result.data && result.data.courtConfig

  return courtConfig
}
