import React from 'react'
import { Button, GU, Header, SidePanel, Split } from '@aragon/ui'

import BalanceModule from './BalanceModule'
import DashboardStats from './DashboardStats'
import TaskTable from './TaskTable'
import { tasks } from '../../mock-data'
import Welcome from './Welcome'

import ANJIcon from '../../assets/anjButton.svg'
import { useConnectedAccount } from '../../providers/Web3'
import { useDashboardLogic, getRequestModeString } from '../../dashboard-logic'
import ActivateANJ from './panels/ActivateANJ'

function Dashboard() {
  const connectedAccount = useConnectedAccount()
  const {
    actions,
    balances,
    mode,
    movements,
    panelState,
    requests,
  } = useDashboardLogic()

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
        title={getRequestModeString(mode)}
        opened={panelState.visible}
        onClose={panelState.requestClose}
        onTransitionEnd={panelState.endTransition}
      >
        <div
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          <ActivateANJ
            onActivateANJ={actions.activateANJ}
            requiresApproval={mode}
          />
        </div>
      </SidePanel>
    </React.Fragment>
  )
}

export default Dashboard
