import React, { useCallback, useEffect, useMemo } from 'react'
import {
  BackButton,
  Bar,
  Box,
  GU,
  Header,
  SidePanel,
  Split,
  SyncIndicator,
} from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import NoEvidence from './NoEvidence'

import { hexToAscii, toDate } from '../../lib/web3-utils'
import { useDisputeLogic, REQUEST_MODE } from '../../dispute-logic'
import CommitPanel from './panels/CommitPanel'
import RevealPanel from './panels/RevealPanel'
import AppealPanel from './panels/AppealPanel'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()
  const { id: disputeId } = match.params

  const {
    actions,
    dispute,
    disputeFetching,
    requestMode,
    panelState,
    requests,
  } = useDisputeLogic(disputeId)

  const evidenceList = dispute && dispute.evidences

  const evidences = useMemo(
    () =>
      (evidenceList || []).map(evidence => ({
        ...evidence,
        data: hexToAscii(evidence.data),
        createdAt: toDate(evidence.createdAt),
      })),
    [evidenceList]
  )

  const handleBack = useCallback(() => {
    history.push('/disputes')
  }, [history])

  const noDispute = !dispute && !disputeFetching

  useEffect(() => {
    // TODO: display a proper error state and let the user retry or go back
    if (noDispute) {
      history.push('/disputes')
    }
  }, [noDispute, history])

  if (noDispute) {
    return null
  }

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
              id={disputeId}
              dispute={dispute}
              loading={disputeFetching}
              onDraft={actions.draft}
              onRequestCommit={requests.commit}
              onRequestReveal={requests.reveal}
              onLeak={actions.leak}
              onRequestAppeal={requests.appeal}
              onExecuteRuling={actions.executeRuling}
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
            <Box heading="Dispute timeline" padding={0}>
              {disputeFetching ? (
                <div css="height: 200px" />
              ) : (
                <DisputeTimeline dispute={dispute} />
              )}
            </Box>
          </React.Fragment>
        }
      />
      <SidePanel
        title={<PanelTitle requestMode={requestMode} disputeId={disputeId} />}
        opened={panelState.visible}
        onClose={panelState.requestClose}
        onTransitionEnd={panelState.endTransition}
      >
        <div
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          <PanelComponent
            dispute={dispute}
            requestMode={requestMode}
            commit={actions.commit}
            reveal={actions.reveal}
            appeal={actions.appeal}
            confirmAppeal={actions.confirmAppeal}
            approveFeeDeposit={actions.approveFeeDeposit}
            onDone={panelState.requestClose}
          />
        </div>
      </SidePanel>
    </React.Fragment>
  )
})

const PanelTitle = ({ requestMode, disputeId }) => {
  const { mode, data } = requestMode

  let title
  if (mode === REQUEST_MODE.COMMIT)
    title = `Commit your vote on dispute #${disputeId}`
  else if (mode === REQUEST_MODE.REVEAL)
    title = `Reveal your vote on dispute #${disputeId}`
  else if (mode === REQUEST_MODE.APPEAL) {
    if (data.confirm) {
      title = `Confirm an appeal on dispute #${disputeId}`
    } else {
      title = `Appeal ruling on dispute #${disputeId}`
    }
  }

  return <span>{title}</span>
}

const PanelComponent = ({
  dispute,
  requestMode,
  commit,
  reveal,
  appeal,
  confirmAppeal,
  approveFeeDeposit,
  ...props
}) => {
  const { mode, data } = requestMode
  switch (mode) {
    case REQUEST_MODE.COMMIT: {
      return (
        <CommitPanel
          dispute={dispute}
          commitment={data.commitment}
          onCommit={commit}
          {...props}
        />
      )
    }
    case REQUEST_MODE.REVEAL:
      return <RevealPanel dispute={dispute} onReveal={reveal} {...props} />
    case REQUEST_MODE.APPEAL:
      return (
        <AppealPanel
          dispute={dispute}
          onApproveFeeDeposit={approveFeeDeposit}
          onAppeal={data.confirm ? confirmAppeal : appeal}
          confirm={data.confirm}
          {...props}
        />
      )
    default:
      return null
  }
}

export default DisputeDetail
