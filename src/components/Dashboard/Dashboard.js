import React from 'react'
import { Header, Split } from '@aragon/ui'

import MainButton from '../MainButton'
import BalanceModule from './BalanceModule'
import DashboardStats from './DashboardStats'
import TaskTable from './TaskTable'
import { tasks } from '../../mock-data'

function Dashboard() {
  // TODO - only for testing we need to use the  connected account
  // const connectedAccount = useConnectedAccount()
  const connectedAccount = '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3'

  return (
    <React.Fragment>
      <Header
        primary="Dashboard"
        secondary={<MainButton label="Buy ANJ" primary />}
      />
      <BalanceModule connectedAccount={connectedAccount} active />
      <Split
        primary={
          <TaskTable tasks={tasks} connectedAccount={connectedAccount} />
        }
        secondary={<DashboardStats />}
      />
    </React.Fragment>
  )
}

export default Dashboard
