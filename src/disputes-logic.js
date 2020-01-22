import { useCallback, useMemo, useState } from 'react'

import { useSidePanel } from './hooks/useSidePanel'
import { useDisputeActions } from './hooks/useCourt'
import useDisputes from './hooks/useDisputes'

export const REQUEST_MODE = {
  NO_REQUEST: Symbol('NO_REQUEST'),
  COMMIT: Symbol('COMMIT'),
  REVEAL: Symbol('REVEAL'),
  APPEAL: Symbol('APPEAL'),
}

const useSelectedDispute = disputes => {
  const [selectedDisputeId, setSelectedDisputeId] = useState(-1)

  const selectDispute = useCallback(
    disputeId => setSelectedDisputeId(disputeId),
    []
  )

  const selectedDispute = useMemo(
    () => disputes.find(dispute => dispute.id === selectedDisputeId) || null,
    [disputes, selectedDisputeId]
  )

  return [selectedDispute, selectDispute]
}

export function usePanelRequestMode(requestPanelOpen) {
  const [requestMode, setRequestMode] = useState(REQUEST_MODE.NO_REQUEST)

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
  const commit = useCallback(() => {
    request(REQUEST_MODE.COMMIT)
  }, [request])

  const reveal = useCallback(() => {
    request(REQUEST_MODE.REVEAL)
  }, [request])

  const appeal = useCallback(() => {
    request(REQUEST_MODE.APPEAL)
  }, [request])

  return { commit, reveal, appeal }
}

export function useDisputesLogic() {
  const panelState = useSidePanel()
  const [mode, setMode] = usePanelRequestMode(panelState.requestOpen)
  const requests = usePanelRequestActions(setMode)

  const [disputes, myDisputes] = useDisputes()

  const [selectedDispute, selectDispute] = useSelectedDispute(disputes)
  const actions = useDisputeActions()

  return {
    actions,
    disputes,
    myDisputes,
    mode,
    panelState,
    requests,
    selectDispute,
    selectedDispute,
  }
}
