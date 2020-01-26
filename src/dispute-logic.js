import { useCallback, useState, useMemo } from 'react'
import { useSidePanel } from './hooks/useSidePanel'
import { useDisputeActions } from './hooks/useCourtContracts'
// import { useSingleDisputeSubscription } from './hooks/subscription-hooks'
import useKeyCodeActions from './hooks/useKeyCodeActions'
import useDispute from './hooks/useDispute'

export const REQUEST_MODE = {
  NO_REQUEST: Symbol('NO_REQUEST'),
  COMMIT: Symbol('COMMIT'),
  REVEAL: Symbol('REVEAL'),
  APPEAL: Symbol('APPEAL'),
  CONFIRM_APPEAL: Symbol('CONFIRM_APPEAL'),
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

  const appeal = useCallback(() => {
    request({ mode: REQUEST_MODE.APPEAL })
  }, [request])

  const confirmAppeal = useCallback(() => {
    request({ mode: REQUEST_MODE.CONFIRM_APPEAL })
  }, [request])

  return useMemo(() => {
    return { commit, reveal, appeal, confirmAppeal }
  }, [appeal, commit, confirmAppeal, reveal])
}

let lastLogic = {}
export function useDisputeLogic(disputeId) {
  const panelState = useSidePanel()
  const [requestMode, setRequestMode] = usePanelRequestMode(
    panelState.requestOpen
  )
  const requests = usePanelRequestActions(setRequestMode)

  const { dispute, fetching } = useDispute(disputeId)

  const actions = useDisputeActions()

  const keyCodeActions = useKeyCodeActions()

  console.log(
    'LOGIC EQ ',
    dispute === lastLogic.dispute,
    fetching === lastLogic.fetching,
    panelState === lastLogic.panelState,
    keyCodeActions === lastLogic.keyCodeActions,
    actions === lastLogic.actions
  )
  lastLogic = { dispute, fetching, panelState, keyCodeActions, actions }

  return useMemo(() => {
    return {
      actions: { ...actions, ...keyCodeActions },
      dispute,
      disputeFetching: fetching,
      requestMode,
      panelState,
      requests,
    }
  }, [
    actions,
    dispute,
    fetching,
    keyCodeActions,
    panelState,
    requestMode,
    requests,
  ])
}
