import React, { useCallback, useMemo } from 'react'
import { Header, SyncIndicator, BackButton, Bar, Box, Split } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import useDisputesSubscription from './hooks/useDisputesSubscription'
import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import NoEvidence from './NoEvidence'

import { hexToAscii, toDate } from '../../lib/web3-utils'
import { useDisputeActions } from '../../hooks/useCourt'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()
  const disputes = useDisputesSubscription()
  const { id: disputeId } = match.params

  const dispute = useMemo(
    () => disputes.find(dispute => dispute.id === disputeId),
    [disputeId, disputes]
  )

  const { subject } = dispute
  const actions = useDisputeActions()

  const evidences = useMemo(
    () =>
      (subject.evidence || []).map(evidence => ({
        ...evidence,
        data: hexToAscii(evidence.data),
        createdAt: toDate(evidence.createdAt),
      })),
    [subject]
  )

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

      <Split
        primary={
          <React.Fragment>
            <DisputeInfo
              dispute={dispute}
              onDraft={actions.draft}
              onCommit={actions.commit}
              onReveal={actions.reveal}
              onLeak={actions.leak}
            />
            {evidences.length > 0 ? (
              <DisputeEvidences evidences={evidences} />
            ) : (
              <NoEvidence />
            )}
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box heading="Voting results">Results</Box>
            <Box heading="Dispute timeline" padding={0}>
              <DisputeTimeline dispute={dispute} />
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
})

export default DisputeDetail
