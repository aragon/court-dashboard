import React from 'react'
import { Button, GU, Header, SidePanel, Split, useLayout } from '@aragon/ui'

import BalanceModule from './BalanceModule'
import Tasks from '../../components/Tasks/Tasks'
import Welcome from './Welcome'

import { DashboardStateProvider } from './DashboardStateProvider'

import ANJIcon from '../../assets/IconANJButton.svg'
import { useConnectedAccount } from '../../providers/Web3'
import {
  getRequestModeString,
  useDashboardLogic,
  REQUEST_MODE,
} from '../../dashboard-logic'
import ActivateANJ from './panels/ActivateANJ'
import DeactivateANJ from './panels/DeactivateANJ'
import WithdrawANJ from './panels/WithdrawANJ'
import AppealColateralModule from './AppealColateralModule'
import RewardsModule from './RewardsModule'

function Dashboard() {
  const connectedAccount = useConnectedAccount()
  const {
    actions,
    appealCollaterals,
    balances,
    mode,
    panelState,
    requests,
  } = useDashboardLogic()

  const { name: layout } = useLayout()
  const oneColumn = layout === 'small' || layout === 'medium'

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
            href="https://anj.aragon.org/"
            target="_blank"
          />
        }
      />
      {connectedAccount ? (
        <BalanceModule
          balances={balances}
          onRequestActivate={requests.activateANJ}
          onRequestDeactivate={requests.deactivateANJ}
          onRequestStakeActivate={requests.stakeActivateANJ}
          onRequestWithdraw={requests.withdrawANJ}
        />
      ) : (
        <Welcome />
      )}

      <Split
        primary={<Tasks onlyTable />}
        secondary={
          <>
            <RewardsModule />
            {appealCollaterals && (
              <AppealColateralModule appeals={appealCollaterals} />
            )}
          </>
        }
        invert={oneColumn ? 'vertical' : 'horizontal'}
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
          activeBalance={activeBalance.amount}
          onDeactivateANJ={deactivateANJ}
          {...props}
        />
      )
    case REQUEST_MODE.WITHDRAW:
      return (
        <WithdrawANJ
          inactiveBalance={inactiveBalance.amount}
          onWithdrawANJ={withdrawANJ}
          {...props}
        />
      )
    default:
      return (
        <ActivateANJ
          activeBalance={activeBalance.amount}
          walletBalance={walletBalance.amount}
          onActivateANJ={activateANJ}
          {...props}
        />
      )
  }
}

export default function DashboardWithSubscritpion(props) {
  return (
    <DashboardStateProvider>
      <Dashboard {...props} />
    </DashboardStateProvider>
  )
}
