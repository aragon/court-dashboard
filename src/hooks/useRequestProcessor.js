import { useCallback } from 'react'
import { useHeartbeat } from './useCourtContracts'
import { useCourtClock } from '../providers/CourtClock'
import { useActivity } from '../providers/ActivityProvider'
import { useRequestQueue } from '../providers/RequestQueue'

import allowedTermsBehind from '../actions/allowedTermsBehind'

export function useRequestProcessor() {
  const { addActivity } = useActivity()
  const { addRequests } = useRequestQueue()
  const { heartbeatRequest } = useHeartbeat()
  const { neededTransitions } = useCourtClock()

  const processRequests = useCallback(
    (requests = []) => {
      const processedRequests = requests.map(
        ({
          action,
          description,
          ensureConfirmation = false,
          isTx = true,
          type,
          ...request
        }) => {
          const intent = isTx
            ? () => addActivity(action(), type, description)
            : action

          return {
            type,
            intent,
            description,
            ensureConfirmation,
            isTx,
            ...request,
          }
        }
      )

      const maxAllowedTermsBehind = processedRequests
        .filter(req => req.isTx)
        .reduce((acc, req) => Math.max(acc, allowedTermsBehind[req.type]), -1)

      // Some court actions require the court clock to be at most x terms behind
      // Check if a term transition is needed
      if (
        maxAllowedTermsBehind >= 0 &&
        neededTransitions > maxAllowedTermsBehind
      ) {
        processedRequests.unshift(heartbeatRequest(neededTransitions, true))
      }

      // Add requests to tx queue
      addRequests(processedRequests)
    },
    [addActivity, addRequests, heartbeatRequest, neededTransitions]
  )

  return processRequests
}
