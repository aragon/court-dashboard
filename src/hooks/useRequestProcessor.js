import { useCallback } from 'react'
import { useHeartbeat } from './useCourtContracts'
import { useCourtClock } from '../providers/CourtClock'
import { useRequestQueue } from '../providers/RequestQueue'
import { useActivity } from '../components/Activity/ActivityProvider'

import radspec from '../radspec'
import allowedTermsBehind from '../allowedTermsBehind'

export function useRequestProcessor() {
  const { request } = useHeartbeat()
  const { addActivity } = useActivity()
  const { addRequests } = useRequestQueue()
  const { neededTransitions } = useCourtClock()

  const processRequests = useCallback(
    requests => {
      const processedRequests = []
        .concat(requests)
        .map(
          ({
            action,
            description,
            ensureConfirmation = false,
            isTx = true,
            name,
            params,
            ...request
          }) => {
            const intent = isTx
              ? () => addActivity(action(), name, params)
              : action

            return {
              name,
              intent,
              description:
                description || radspec[name](...Object.values(params)),
              ensureConfirmation,
              isTx,
              ...request,
            }
          }
        )

      const maxAllowedTermsBehind = processedRequests
        .filter(req => req.isTx)
        .reduce((acc, req) => Math.max(acc, allowedTermsBehind[req.name]), -1)

      // Some court actions require the court clock to be at most x terms behind
      // Check if a term transition is needed
      if (
        maxAllowedTermsBehind >= 0 &&
        neededTransitions > maxAllowedTermsBehind
      ) {
        processedRequests.unshift(request(neededTransitions, true))
      }

      // Add requests to tx queue
      addRequests(processedRequests)
    },
    [addActivity, addRequests, neededTransitions, request]
  )

  return processRequests
}
