import React from 'react'
import { Button, Header, Split } from '@aragon/ui'

import ProfileHeader from './ProfileHeader'
import DashboardStats from './DashboardStats'
import TaskTable from './TaskTable'
import { tasks } from '../../mock-data'
import { useWeb3Connect } from '../../providers/Web3'

function Dashboard() {
  // TODO - only for testing we need to use the  connected account
  // const connectedAccount = useConnectedAccount()

  const web3 = useWeb3Connect()
  const connectedAccount = '0x593e1F9809658d0c92e9f092cF01Aad7D0d734f3'

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
        primary={
          <TaskTable tasks={tasks} connectedAccount={connectedAccount} />
        }
        secondary={<DashboardStats />}
      />
    </React.Fragment>
  )
}

export default Dashboard
