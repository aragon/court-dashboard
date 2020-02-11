import React from 'react'
import { GU, SidePanel, Split, useLayout } from '@aragon/ui'

import Welcome from './Welcome'
import Tasks from '../Tasks/Tasks'
import TitleHeader from '../TitleHeader'
import BalanceModule from './BalanceModule'
import RewardsModule from './RewardsModule'
import ActivateANJ from './panels/ActivateANJ'
import WithdrawANJ from './panels/WithdrawANJ'
import DeactivateANJ from './panels/DeactivateANJ'
import AppealColateralModule from './AppealColateralModule'

import { useWallet } from '../../providers/Wallet'
import { DashboardStateProvider } from './DashboardStateProvider'
import {
  getRequestModeString,
  useDashboardLogic,
  REQUEST_MODE,
} from '../../dashboard-logic'
import {
  getTotalUnlockedActiveBalance,
  getTotalEffectiveInactiveBalance,
} from '../../utils/balance-utils'

function Dashboard() {
  const wallet = useWallet()
  const {
    actions,
    appealCollaterals,
    balances,
    rewards,
    fetchingData,
    // errorsFetching, //TODO: handle errors
    mode,
    panelState,
    requests,
  } = useDashboardLogic()

  const { name: layout } = useLayout()
  const oneColumn = layout === 'small' || layout === 'medium'

  return (
    <React.Fragment>
      <TitleHeader title="Dashboard" onlyTitle={!wallet.account} />
      {wallet.account ? (
        <BalanceModule
          balances={balances}
          loading={fetchingData}
          onRequestWithdraw={requests.withdrawANJ}
          onRequestActivate={requests.activateANJ}
          onRequestDeactivate={requests.deactivateANJ}
          onRequestStakeActivate={requests.stakeActivateANJ}
        />
      ) : (
        <Welcome />
      )}

      {!wallet.account ? (
        <Tasks onlyTable />
      ) : (
        <Split
          primary={<Tasks onlyTable />}
          secondary={
            <>
              <RewardsModule
                rewards={rewards}
                loading={fetchingData}
                onWithdraw={actions.withdraw}
                onSettleReward={actions.settleReward}
                onSettleAppealDeposit={actions.settleAppealDeposit}
              />
              <AppealColateralModule
                appeals={appealCollaterals}
                loading={fetchingData}
              />
            </>
          }
          invert={oneColumn ? 'vertical' : 'horizontal'}
        />
      )}

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
  const { walletBalance, activeBalance } = balances

  const unlockedActiveBalance = getTotalUnlockedActiveBalance(balances)
  const effectiveInactiveBalance = getTotalEffectiveInactiveBalance(balances)

  switch (mode) {
    case REQUEST_MODE.DEACTIVATE:
      return (
        <DeactivateANJ
          activeBalance={unlockedActiveBalance}
          onDeactivateANJ={deactivateANJ}
          {...props}
        />
      )
    case REQUEST_MODE.WITHDRAW:
      return (
        <WithdrawANJ
          inactiveBalance={effectiveInactiveBalance}
          onWithdrawANJ={withdrawANJ}
          {...props}
        />
      )
    default:
      return (
        <ActivateANJ
          activeBalance={activeBalance.amount}
          inactiveBalance={effectiveInactiveBalance}
          walletBalance={walletBalance.amount}
          onActivateANJ={activateANJ}
          fromWallet={mode === REQUEST_MODE.STAKE_ACTIVATE}
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
