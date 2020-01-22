import React, { useCallback, useMemo } from 'react'
import { Header, SyncIndicator, BackButton, Bar, Box, Split } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import useDisputeSubscription from './hooks/useDisputeSubscription'
import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import { hexToAscii, toDate } from '../../lib/web3-utils'
import NoEvidence from './NoEvidence'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()
  const { id: disputeId } = match.params

  const {
    dispute,
    fetching: disputeFetching,
    // error: disputeFetchingError, // TODO: handle loading error
  } = useDisputeSubscription(disputeId)

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

  return (
    <React.Fragment>
      <SyncIndicator visible={disputeFetching} label="Loading dispute…" />
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
              loading={disputeFetching}
            />
            {(() => {
              if (disputeFetching) {
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
            <Box heading="Voting results">{disputeFetching && 'Results'}</Box>
            <Box heading="Dispute timeline" padding={0}>
              {disputeFetching ? (
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
