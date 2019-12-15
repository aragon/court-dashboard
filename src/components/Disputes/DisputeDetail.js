import React from 'react'
import { BackButton, Bar, Box, Split } from '@aragon/ui'

import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'

function DisputeDetail({ dispute, onBack }) {
  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>

      <Split
        primary={
          <React.Fragment>
            <DisputeInfo dispute={dispute} />
            {dispute.evidences && (
              <DisputeEvidences evidences={dispute.evidences} />
            )}
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box heading="Voting results">Results</Box>
            <Box heading="Dispute timeline" padding={0}>
              <DisputeTimeline />
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

export default DisputeDetail
