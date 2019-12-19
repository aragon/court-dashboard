import React from 'react'
import { BackButton, Bar, Box, Split } from '@aragon/ui'

import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import { hexToAscii, toDate } from '../Lib/web3'

function DisputeDetail({ dispute, onBack }) {
  console.log('DISPUTE ', dispute)

  const { subject } = dispute

  const evidences = subject.evidence
    ? subject.evidence.map(evidence => {
        return {
          ...evidence,
          data: hexToAscii(evidence.data),
          createdAt: toDate(evidence.createdAt),
        }
      })
    : []

  console.log('evidences ', evidences)
  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>

      <Split
        primary={
          <React.Fragment>
            <DisputeInfo dispute={dispute} />
            {evidences.length > 0 && <DisputeEvidences evidences={evidences} />}
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
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
