import React from 'react'
import { BackButton, Bar, Box, Split } from '@aragon/ui'
import DisputeInfo from './DisputeInfo'

import Timeline from './Timeline'

function DisputeDetail({ dispute, onBack }) {
  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>

      <Split
        primary={<DisputeInfo dispute={dispute} />}
        secondary={
          <Box heading="Dispute timeline">
            <Timeline />
          </Box>
        }
      />
    </React.Fragment>
  )
}

export default DisputeDetail
