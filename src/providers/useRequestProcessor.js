import { useCallback } from 'react'
import { useCourtClock } from './CourtClock'
import { useRequestQueue } from './RequestQueue'
import { useHeartbeat } from '../hooks/useCourtContracts'
import { useActivity } from '../components/Activity/ActivityProvider'

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
