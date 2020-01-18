import React, { useCallback, useMemo } from 'react'
import { Header, SyncIndicator, BackButton, Bar, Box, Split } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import useDisputesSubscription from './hooks/useDisputesSubscription'
import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'

function DisputeDetail({ match }) {
  const history = useHistory()
  const disputes = useDisputesSubscription()
  const { id: disputeId } = match.params

  const dispute = useMemo(() => {
    return disputes.find(dispute => dispute.id === disputeId)
  }, [disputeId, disputes])

  const handleBack = useCallback(() => {
    history.push('/disputes')
  }, [history])

  return (
    <React.Fragment>
      <SyncIndicator visible={!dispute} label="Loading dispute…" />

      <Header primary="Disputes" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>

      {dispute && (
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
      )}
    </React.Fragment>
  )
}

export default DisputeDetail
