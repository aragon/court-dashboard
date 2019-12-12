import React from 'react'
import { Button, Box, Header, Split } from '@aragon/ui'

import ProfileHeader from './ProfileHeader'
import DashboardStats from './DashboardStats'

function Dashboard() {
  return (
    <React.Fragment>
      <Header
        primary="Dashboard"
        secondary={<Button label="Buy ANJ" mode="strong" />}
      />
      <ProfileHeader active />
      <Split primary={<Box />} secondary={<DashboardStats />} />
    </React.Fragment>
  )
}

export default Dashboard
