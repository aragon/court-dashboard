import { useCallback, useState } from 'react'

import { useANJActions, useRewardActions } from './hooks/useCourtContracts'
import { useSidePanel } from './hooks/useSidePanel'
import { useANJBalances } from './hooks/useANJ'
import { useDashboardState } from './components/Dashboard/DashboardStateProvider'
import useJurorRewards from './hooks/useJurorRewards'
import useJurorAppealCollaterals from './hooks/useJurorAppealCollaterals'

export const REQUEST_MODE = {
  ACTIVATE: Symbol('ACTIVATE'),
  DEACTIVATE: Symbol('DEACTIVATE'),
  STAKE_ACTIVATE: Symbol('STAKE_ACTIVATE'),
  WITHDRAW: Symbol('WITHDRAW'),
}

const stringMapping = {
  [REQUEST_MODE.ACTIVATE]: 'Activate',
  [REQUEST_MODE.STAKE_ACTIVATE]: 'Activate',
  [REQUEST_MODE.DEACTIVATE]: 'Deactivate',
  [REQUEST_MODE.WITHDRAW]: 'Withdraw',
}

export function getRequestModeString(mode) {
  return stringMapping[mode]
}

export function usePanelRequestMode(requestPanelOpen) {
  const [requestMode, setRequestMode] = useState(REQUEST_MODE.ACTIVATE)

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
  // TODO: Should we implement only one request function to recieve the request mode ?
  const activateANJ = useCallback(() => {
    request(REQUEST_MODE.ACTIVATE)
  }, [request])

  const deactivateANJ = useCallback(() => {
    request(REQUEST_MODE.DEACTIVATE)
  }, [request])

  const stakeActivateANJ = useCallback(() => {
    request(REQUEST_MODE.STAKE_ACTIVATE)
  }, [request])

  const withdrawANJ = useCallback(() => {
    request(REQUEST_MODE.WITHDRAW)
  }, [request])

  return { activateANJ, deactivateANJ, stakeActivateANJ, withdrawANJ }
}

export function useDashboardLogic() {
  const {
    activateANJ,
    deactivateANJ,
    stakeActivateANJ,
    withdrawANJ,
  } = useANJActions()

  const panelState = useSidePanel()
  const balances = useANJBalances()
  const rewards = useJurorRewards()
  const appealCollaterals = useJurorAppealCollaterals()
  const { fetching: fetchingData, errors: errorsFetching } = useDashboardState()

  const [mode, setMode] = usePanelRequestMode(panelState.requestOpen)
  const requests = usePanelRequestActions(setMode)

  const { settleReward, settleAppealDeposit, withdraw } = useRewardActions()
  const actions = {
    activateANJ:
      mode === REQUEST_MODE.STAKE_ACTIVATE ? stakeActivateANJ : activateANJ,
    deactivateANJ,
    withdrawANJ,
    settleReward,
    settleAppealDeposit,
    withdraw,
  }

  return {
    actions,
    appealCollaterals,
    balances,
    rewards,
    fetchingData,
    errorsFetching,
    mode,
    panelState,
    requests,
  }
}
