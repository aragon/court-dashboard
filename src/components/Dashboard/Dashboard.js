import React from 'react'
import { Button, GU, Header, SidePanel, Split } from '@aragon/ui'

import BalanceModule from './BalanceModule'
import DashboardStats from './DashboardStats'
import TaskTable from './TaskTable'
import { tasks } from '../../mock-data'
import Welcome from './Welcome'
import { BalancesProvider, useBalances } from './BalancesProvider'

import ANJIcon from '../../assets/anjButton.svg'
import { useConnectedAccount } from '../../providers/Web3'
import {
  getRequestModeString,
  useDashboardLogic,
  REQUEST_MODE,
} from '../../dashboard-logic'
import ActivateANJ from './panels/ActivateANJ'
import DeactivateANJ from './panels/DeactivateANJ'
import WithdrawANJ from './panels/WithdrawANJ'

function Dashboard() {
  const connectedAccount = useConnectedAccount()
  const { actions, mode, panelState, requests } = useDashboardLogic()
  const { balances, movements } = useBalances()

  return (
    <React.Fragment>
      <Header
        primary="Dashboard"
        secondary={
          <Button
            icon={
              <img
                src={ANJIcon}
                css={`
                  width: 14px;
                  height: 16px;
                `}
              />
            }
            label="Buy ANJ"
            mode="strong"
            display="all"
          />
        }
      />
      {connectedAccount ? (
        <BalanceModule
          balances={balances}
          movements={movements}
          onRequestActivate={requests.activateANJ}
          onRequestDeactivate={requests.deactivateANJ}
          onRequestStakeActivate={requests.stakeActivateANJ}
          onRequestWithdraw={requests.withdrawANJ}
        />
      ) : (
        <Welcome />
      )}

      <Split
        primary={<TaskTable tasks={tasks} />}
        secondary={<DashboardStats />}
      />
      <SidePanel
        title={`${getRequestModeString(mode)} ANJ`}
        opened={panelState.visible}
        onClose={panelState.requestClose}
        onTransitionEnd={panelState.endTransition}
      >
        <div
          css={`
            margin-top: ${2 * GU}px;
          `}
        />
        <PanelComponent
          mode={mode}
          actions={actions}
          balances={balances}
          onDone={panelState.requestClose}
          panelOpened={panelState.opened}
        />
      </SidePanel>
    </React.Fragment>
  )
}

function PanelComponent({ mode, actions, balances, ...props }) {
  const { activateANJ, deactivateANJ, withdrawANJ } = actions
  const { walletBalance, activeBalance, inactiveBalance } = balances

  switch (mode) {
    case REQUEST_MODE.DEACTIVATE:
      return (
        <DeactivateANJ
          activeBalance={activeBalance}
          onDeactivateANJ={deactivateANJ}
          {...props}
        />
      )
    case REQUEST_MODE.WITHDRAW:
      return (
        <WithdrawANJ
          inactiveBalance={inactiveBalance}
          onWithdrawANJ={withdrawANJ}
          {...props}
        />
      )
    default:
      return (
        <ActivateANJ
          activeBalance={activeBalance}
          walletBalance={walletBalance}
          onActivateANJ={activateANJ}
          {...props}
        />
      )
  }
}

export default function DashboardWithSubscritpion({ props }) {
  return (
    <BalancesProvider>
      <Dashboard {...props} />
    </BalancesProvider>
  )
}
