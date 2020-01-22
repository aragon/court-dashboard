import { useCallback, useMemo, useState } from 'react'

import { useSidePanel } from './hooks/useSidePanel'
import { useDisputeActions } from './hooks/useCourt'
import useDisputes from './hooks/useDisputes'

export const REQUEST_MODE = {
  NO_REQUEST: Symbol('NO_REQUEST'),
  COMMIT: Symbol('COMMIT'),
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

  return { commit }
}

function useSelectedDispute(disputes, disputeId) {
  return useMemo(() => disputes.find(dispute => dispute.id === disputeId), [
    disputeId,
    disputes,
  ])
}

export function useDisputeLogic(disputeId) {
  const panelState = useSidePanel()
  const [requestMode, setRequestMode] = usePanelRequestMode(
    panelState.requestOpen
  )
  const requests = usePanelRequestActions(setRequestMode)

  const [disputes] = useDisputes()
  const dispute = useSelectedDispute(disputes, disputeId)

  const actions = useDisputeActions()

  return {
    actions,
    dispute,
    requestMode,
    panelState,
    requests,
    isSyncing: !dispute,
  }
}
