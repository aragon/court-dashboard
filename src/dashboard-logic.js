import { useCallback, useState } from 'react'

import { useCourtConfig } from './providers/CourtConfig'
import { useConnectedAccount } from './providers/Web3'

import useJurorBalances from './hooks/useJurorBalances'
import { useANJMovements } from './hooks/useANJ'
import { useCourtActions } from './hooks/useCourtActions'
import { useSidePanel } from './hooks/useSidePanel'

export const REQUEST_MODE = {
  ACTIVATE: Symbol('ACTIVATE'),
  DEACTIVATE: Symbol('DEACTIVATE'),
  STAKE_ACTIVATE: Symbol('STAKE_ACTIVATE'),
  WITHDRAW: Symbol('WITHDRAW'),
}

const stringMapping = {
  [REQUEST_MODE.ACTIVATE]: 'Activate ANJ',
  [REQUEST_MODE.STAKE_ACTIVATE]: 'Activate ANJ',
  [REQUEST_MODE.DEACTIVATE]: 'Deactivate ANJ',
  [REQUEST_MODE.WITHDRAW]: 'Withdraw ANJ',
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
  const { anjToken } = useCourtConfig()
  const { activateANJ, stakeActivateANJ } = useCourtActions()
  const connectedAccount = useConnectedAccount()

  const { balances, movements } = useJurorBalances(
    connectedAccount ? connectedAccount.toLocaleLowerCase() : ''
  )

  const panelState = useSidePanel()
  const [mode, setMode] = usePanelRequestMode(panelState.requestOpen)
  const requests = usePanelRequestActions(setMode)

  const {
    walletMovement,
    inactiveBalanceMovement,
    activeBalanceMovement,
  } = useANJMovements(movements, anjToken.decimals)

  const actions = {
    activateANJ:
      mode === REQUEST_MODE.STAKE_ACTIVATE ? stakeActivateANJ : activateANJ,
  }

  return {
    actions,
    balances,
    mode,
    movements: {
      walletMovement,
      inactiveBalanceMovement,
      activeBalanceMovement,
    },
    panelState,
    requests,
  }
}
