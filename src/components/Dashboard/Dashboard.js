import React from 'react'
import { Button, Header, Split } from '@aragon/ui'

import ProfileHeader from './ProfileHeader'
import DashboardStats from './DashboardStats'
import TaskTable from './TaskTable'
import { tasks } from '../../mock-data'
import { useWeb3Connect } from '../../providers/Web3'

function Dashboard() {
  const web3 = useWeb3Connect()

  return (
    <React.Fragment>
      <Header
        primary="Dashboard"
        secondary={
          <Button
            label="Buy ANJ"
            mode="strong"
            onClick={() => web3.activate('injected')}
          />
        }
      />
      <ProfileHeader active />
      <Split
        primary={<TaskTable tasks={tasks} />}
        secondary={<DashboardStats />}
      />
    </React.Fragment>
  )
}

export default Dashboard
