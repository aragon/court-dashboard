import React from 'react'
import { BackButton, Bar, Box, Split } from '@aragon/ui'

import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import { hexToAscii, toDate } from '../../lib/web3'
import NoEvidence from './NoEvidence'

function DisputeDetail({ dispute, onBack }) {
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

  return (
    <React.Fragment>
      <Bar>
        <BackButton onClick={onBack} />
      </Bar>

      <Split
        primary={
          <React.Fragment>
            <DisputeInfo dispute={dispute} />
            {evidences.length > 0 ? (
              <DisputeEvidences evidences={evidences} />
            ) : (
              <NoEvidence />
            )}
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box heading="Dispute timeline" padding={0}>
              <DisputeTimeline dispute={dispute} />
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}

export default DisputeDetail
