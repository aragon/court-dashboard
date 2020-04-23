import {
  REQUEST_STATUS_CONFIRMED,
  REQUEST_STATUS_FAILED,
  REQUEST_STATUS_PENDING,
  REQUEST_STATUS_PROCESSED,
  REQUEST_STATUS_PROCESSING_FAILED,
} from '../request-statuses'

export function getRequestLabelText(request, status) {
  if (
    status === REQUEST_STATUS_PROCESSING_FAILED ||
    status === REQUEST_STATUS_FAILED
  ) {
    if (request.isTx) {
      return status === REQUEST_STATUS_PROCESSING_FAILED
        ? 'Signing transaction failed!'
        : 'Transaction failed'
    }

    return request.onError
  }

  if (status === REQUEST_STATUS_CONFIRMED) {
    return 'Transaction confirmed!'
  }

  if (status === REQUEST_STATUS_PENDING) {
    return 'Transaction being mined…'
  }

  if (status === REQUEST_STATUS_PROCESSED) {
    return request.isTx ? 'Transaction signed!' : request.onSuccess
  }

  return request.isTx ? 'Waiting for signature…' : request.description
}

export function hasRequestSucceeded(request, status) {
  return (
    status === REQUEST_STATUS_CONFIRMED ||
    (status === REQUEST_STATUS_PROCESSED && !request.ensureConfirmation)
  )
}

export function hasRequestFailed(status) {
  return (
    status === REQUEST_STATUS_PROCESSING_FAILED ||
    status === REQUEST_STATUS_FAILED
  )
}
