import { useCallback, useState } from 'react'

import { useSidePanel } from './hooks/useSidePanel'
import { useDisputeActions } from './hooks/useCourtContracts'
import { useDispute } from './hooks/useDisputes'

export const REQUEST_MODE = {
  NO_REQUEST: Symbol('NO_REQUEST'),
  COMMIT: Symbol('COMMIT'),
  REVEAL: Symbol('REVEAL'),
  APPEAL: Symbol('APPEAL'),
}

export function usePanelRequestMode(requestPanelOpen) {
  const [requestMode, setRequestMode] = useState({
    mode: REQUEST_MODE.NO_REQUEST,
    data: {},
  })

  const updateMode = useCallback(
    newMode => {
      setRequestMode(newMode)
      requestPanelOpen()
    },
    [requestPanelOpen]
  )

  return [requestMode, updateMode]
}

// Requests to set new mode and open side panel
export function usePanelRequestActions(request) {
  const commit = useCallback(
    commitment => {
      request({ mode: REQUEST_MODE.COMMIT, data: { commitment } })
    },
    [request]
  )

  const reveal = useCallback(() => {
    request({ mode: REQUEST_MODE.REVEAL })
  }, [request])

  const appeal = useCallback(
    confirm => {
      request({ mode: REQUEST_MODE.APPEAL, data: { confirm } })
    },
    [request]
  )

  return { commit, reveal, appeal }
}

export function useDisputeLogic(disputeId) {
  const panelState = useSidePanel()
  const [requestMode, setRequestMode] = usePanelRequestMode(
    panelState.requestOpen
  )
  const requests = usePanelRequestActions(setRequestMode)

  const [dispute, disputeFetching, error] = useDispute(disputeId)

  const actions = useDisputeActions()

  return {
    actions,
    error,
    dispute,
    disputeFetching,
    requestMode,
    panelState,
    requests,
  }
}
