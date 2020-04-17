import { makeResult } from 'urql'
import { filter, make, merge, mergeMap, pipe, share } from 'wonka'
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
  const isOperationType = operation => {
    const { operationName } = operation
    return operationName === operationType
  }

  return ops$ => {
    const sharedOps$ = share(ops$)
    const results$ = pipe(
      sharedOps$,
      filter(isOperationType),
      mergeMap(convertMockedData)
    )

    const forward$ = pipe(
      sharedOps$,
      filter(op => !isOperationType(op)),
      forward
    )

    return merge([results$, forward$])
  }
}

const convertMockedData = operation => {
  return make(({ next, complete }) => {
    const { name: queryName } = operation.query.definitions.find(
      node => node.kind === OPERATION_DEFINITION && node.name
    )

    // Get the desired mocked data
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

    return () => {}
  })
}
