import { useSubscription } from 'urql'
import { ANJBalance, Juror } from '../queries/balances'

const DAY_IN_SECONDS = 86400

function useANJBalance(jurorId) {
  const [result] = useSubscription({
    query: ANJBalance,
    variables: { id: jurorId.toLowerCase() },
  })
  const data = result.data ? result.data.anjbalance : undefined

  return { ...result, data }
}

function useJuror(jurorId) {
  // get 24hs from current time
  const yesterday = Math.ceil(Date.now() / 1000) - DAY_IN_SECONDS
  const [result] = useSubscription({
    query: Juror,
    variables: { id: jurorId.toLowerCase(), from: yesterday },
  })

  const data = result.data ? result.data.juror : undefined
  return { ...result, data }
}

export default function useJurorBalances(jurorId) {
  // My wallet balance
  const {
    data: anjBalanceData,
    error: anjBalanceError,
    fetching: anjBalanceFetching,
  } = useANJBalance(jurorId)

  // Active, inactive balance
  const {
    data: jurorData,
    error: jurorError,
    fetching: jurorFetching,
  } = useJuror(jurorId)

  const fetching = anjBalanceFetching || jurorFetching
  const errors = [anjBalanceError, jurorError].filter(err => err)

  const balances = {
    // TODO: find cleaner way
    walletBalance: anjBalanceData ? anjBalanceData.amount : '0',
    activeBalance: jurorData ? jurorData.activeBalance : '0',
    lockedBalance: jurorData ? jurorData.lockedBalance : '0',
    availableBalance: jurorData ? jurorData.availableBalance : '0',
    deactivationBalance: jurorData ? jurorData.deactivationBalance : '0',
  }

  const movements = jurorData ? jurorData.movements : []

  return { balances, movements, fetching, errors }
}
