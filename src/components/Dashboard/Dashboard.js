import React from 'react'
import { Box, Header, Split } from '@aragon/ui'

import MainButton from '../MainButton'
import ProfileHeader from './ProfileHeader'
import LatestActivity from './LatestActivity'

function Dashboard() {
  return (
    <React.Fragment>
      <Header
        primary="Dashboard"
        secondary={<MainButton label="Buy ANJ" primary />}
      />
      <ProfileHeader active />
      <Split primary={<Box />} secondary={<LatestActivity />} />
    </React.Fragment>
  )
}

export default Dashboard
