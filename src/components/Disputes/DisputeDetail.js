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
          <React.Fragment>
            <Box heading="Voting results">Results</Box>
            <Box heading="Dispute timeline" padding={0}>
              <Timeline />
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

export default DisputeDetail
