import { makeResult } from 'urql'
import { filter, make, merge, mergeMap, pipe, share, takeUntil } from 'wonka'
import mockData from '../data'

const OPERATION_DEFINITION = 'OperationDefinition'

// Fetch exchange
export const mockFetchExchange = ({ forward }) => {
  return handleOperation('query', forward)
}

// Subscription exchange
export const mockSubscriptionExchange = ({ forward }) => {
  return handleOperation('subscription', forward)
}

function handleOperation(operationType, forward) {
  const isDesiredOperation = operation => {
    const { operationName } = operation
    return operationName === operationType
  }

  return ops$ => {
    const sharedOps$ = share(ops$)
    const subscriptionResults$ = pipe(
      sharedOps$,
      filter(isDesiredOperation),
      mergeMap(operation => {
        const { key } = operation
        const teardown$ = pipe(
          sharedOps$,
          filter(op => op.operationName === 'teardown' && op.key === key)
        )

        return pipe(convertMockedData(operation), takeUntil(teardown$))
      })
    )

    const forward$ = pipe(
      sharedOps$,
      filter(op => !isDesiredOperation(op)),
      forward
    )

    return merge([subscriptionResults$, forward$])
  }
}

const convertMockedData = operation => {
  return make(({ next, complete }) => {
    const { name: queryName } = operation.query.definitions.find(
      node => node.kind === OPERATION_DEFINITION && node.name
    )

    const abortController =
      typeof AbortController !== 'undefined' ? new AbortController() : undefined

    const convertedData = mockData[queryName.value](operation.variables)

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
