import React from 'react'
import { BackButton, Bar, Box, Split } from '@aragon/ui'

import Timeline from './Timeline'

function DisputeDetail({ dispute, onBack }) {
  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>

      <Split
        primary={
          <Box>
            <div>Dispute detail #{dispute.id}</div>
          </Box>
        }
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
