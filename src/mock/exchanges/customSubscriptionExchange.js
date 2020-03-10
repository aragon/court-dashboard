import { makeResult, subscriptionExchange } from 'urql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { filter, make, merge, mergeMap, pipe, share, takeUntil } from 'wonka'

import env from '../../environment'
import mockedData from '../mock-data'
import endpoints from '../../endpoints'

const OPERATION_DEFINITION = 'OperationDefinition'
const GRAPH_API_ENDPOINTS = endpoints()

export const subscriptionClient = new SubscriptionClient(
  GRAPH_API_ENDPOINTS[1],
  {
    reconnect: true,
    reconnectionAttempts: 10,
  }
)

const DEFAULT_SUBSCRIPTION_EXCHANGE = subscriptionExchange({
  forwardSubscription: operation => subscriptionClient.request(operation),
})

const customSubscriptionExchange = ({ forward }) => {
  const isSubscriptionOperation = operation => {
    const { operationName } = operation
    return operationName === 'subscription'
  }

  return ops$ => {
    const sharedOps$ = share(ops$)
    const subscriptionResults$ = pipe(
      sharedOps$,
      filter(isSubscriptionOperation),
      mergeMap(operation => {
        const { key } = operation
        const teardown$ = pipe(
          sharedOps$,
          filter(op => op.operationName === 'teardown' && op.key === key)
        )

        return pipe(mockData(operation), takeUntil(teardown$))
      })
    )

    const forward$ = pipe(
      sharedOps$,
      filter(op => !isSubscriptionOperation(op)),
      forward
    )

    return merge([subscriptionResults$, forward$])
  }
}

const mockData = operation => {
  return make(({ next, complete }) => {
    console.log('subscription mock operation', operation)

    const { name: queryName } = operation.query.definitions.find(
      node => node.kind === OPERATION_DEFINITION && node.name
    )

    const abortController =
      typeof AbortController !== 'undefined' ? new AbortController() : undefined
    const convertedData = mockedData[queryName.value]

    Promise.resolve()
      .then(() =>
        makeResult(
          operation,
          {
            data: convertedData,
          },
          null
        )
      )
      .then(result => {
        next(result)
        complete()
      })

    return () => {
      if (abortController !== undefined) {
        abortController.abort()
      }
    }
  })
}

export default env('MOCK_TEST')
  ? customSubscriptionExchange
  : DEFAULT_SUBSCRIPTION_EXCHANGE
