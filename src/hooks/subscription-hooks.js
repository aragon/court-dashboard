import { useMemo, useState } from 'react'
import { useSubscription } from 'urql'
import dayjs from 'dayjs'

import { transformResponseDisputeAttributes } from '../utils/dispute-utils'
import { bigNum } from '../lib/math-utils'

import { OpenTasks } from '../queries/tasks'
import { CourtConfig } from '../queries/court'
import { AllDisputes, SingleDispute } from '../queries/disputes'
import { ANJBalance, Juror } from '../queries/balances'

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
    availableBalance: jurorData
      ? bigNum(jurorData.availableBalance)
      : NO_AMOUNT,
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

export function useCourtSubscription() {
  const [court, setCourt] = useState([])
  const handleSubscription = (lastResponse = [], response) => {
    return setCourt(response.courtConfig)
  }
  useSubscription(
    {
      query: CourtConfig,
    },
    handleSubscription
  )
  return court
}

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

export function useDisputesSubscription() {
  const [disputes, setDisputes] = useState([])
  const courtConfig = useCourtConfig()
  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = [], response) => {
    /** Here we are reducing all the response againg because the response is not returning only the new elements or modified elements
     So we don't have a way to know if some item was updated or not. The first argument is where the previouse subscription response comes
     */
    return setDisputes(
      response.disputes.map(dispute =>
        transformResponseDisputeAttributes(dispute, courtConfig)
      )
    )
  }
  useSubscription(
    {
      query: AllDisputes,
      variables: {},
    },
    handleSubscription
  )

  return disputes
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
