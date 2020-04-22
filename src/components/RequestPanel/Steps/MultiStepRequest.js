import React from 'react'
import { RequestStepItem } from './RequestSteps'

function MultiStepRequest({ lastProcessedAt, requests, requestStatus }) {
  return requests.map((request, index) => {
    const status = requestStatus[index]

    return (
      <RequestStepItem
        key={index}
        lastProcessedAt={lastProcessedAt}
        status={status}
        stepNumber={index + 1}
        request={request}
      />
    )
  })
}

export default MultiStepRequest
