import React, { useCallback, useMemo } from 'react'
import { Header, SyncIndicator, BackButton, Bar, Box, Split } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import useDisputesSubscription from './hooks/useDisputesSubscription'
import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import { hexToAscii, toDate } from '../../lib/web3-utils'
import NoEvidence from './NoEvidence'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()
  const disputes = useDisputesSubscription()
  const { id: disputeId } = match.params

  const dispute = useMemo(
    () => disputes.find(dispute => dispute.id === disputeId),
    [disputeId, disputes]
  )

  const subject = dispute && dispute.subject

  const evidences = useMemo(
    () =>
      ((subject && subject.evidence) || []).map(evidence => ({
        ...evidence,
        data: hexToAscii(evidence.data),
        createdAt: toDate(evidence.createdAt),
      })),
    [subject]
  )

  const handleBack = useCallback(() => {
    history.push('/disputes')
  }, [history])

  const isLoading = !dispute

  return (
    <React.Fragment>
      <SyncIndicator visible={isLoading} label="Loading dispute…" />
      <Header primary="Disputes" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>
      <Split
        primary={
          <React.Fragment>
            <DisputeInfo
              dispute={dispute}
              id={disputeId}
              isLoading={isLoading}
            />
            {(() => {
              if (isLoading) {
                return null
              }
              if (evidences.length === 0) {
                return <NoEvidence />
              }
              return <DisputeEvidences evidences={evidences} />
            })()}
          </React.Fragment>
        }
        secondary={
          <React.Fragment>
            <Box heading="Voting results">{isLoading && 'Results'}</Box>
            <Box heading="Dispute timeline" padding={0}>
              {isLoading ? (
                <div css="height: 100px" />
              ) : (
                <DisputeTimeline dispute={dispute} />
              )}
            </Box>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
})

export default DisputeDetail
