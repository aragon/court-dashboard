import React from 'react'
import { Button, Header, Split } from '@aragon/ui'

import BalanceModule from './BalanceModule'
import DashboardStats from './DashboardStats'
import TaskTable from './TaskTable'
import { tasks } from '../../mock-data'
import { useConnectedAccount } from '../../providers/Wallet'
import Welcome from './Welcome'

import ANJIcon from '../../assets/anjButton.svg'

function Dashboard() {
  const connectedAccount = useConnectedAccount()

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
            display="all"
            mode="strong"
          />
        }
      />
      {connectedAccount ? <BalanceModule /> : <Welcome />}

      <Split
        primary={<TaskTable tasks={tasks} />}
        secondary={<DashboardStats />}
      />
    </React.Fragment>
  )
}

export default Dashboard
