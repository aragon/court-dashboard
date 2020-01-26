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
import AppealPanel from './panels/AppealPanel'

let lastDDCall = {}
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

  console.log('DISPUTE DETAIL EQUALS ', dispute === lastDDCall.dispute)
  lastDDCall = { dispute }
  console.log('DISPUTE DETAIL ', dispute)

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

      {!disputeFetching && (
        <Split
          primary={
            <React.Fragment>
              <DisputeInfo
                dispute={dispute}
                loading={disputeFetching}
                onDraft={actions.draft}
                onRequestCommit={requests.commit}
                onReveal={actions.reveal}
                onLeak={actions.leak}
                onRequestAppeal={requests.appeal}
                onRequestConfirmAppeal={requests.confirmAppeal}
                onExecuteRuling={actions.executeRuling}
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
      )}
      <SidePanel
        title="title"
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
            actions={actions}
          />
        </div>
      </SidePanel>
    </React.Fragment>
  )
})

const PanelComponent = React.memo(function PanelComponent({
  dispute,
  requestMode,
  actions,
  ...props
}) {
  const { mode, data } = requestMode
  const { commit, appeal, keyCode, downloadKeyCode } = actions
  switch (mode) {
    case REQUEST_MODE.COMMIT: {
      console.log('KEYYYY ', keyCode)
      return (
        <CommitPanel
          dispute={dispute}
          commitment={data.commitment}
          onCommit={commit}
          keyCode={keyCode}
          onDownloadKeyCode={downloadKeyCode}
          {...props}
        />
      )
    }
    case REQUEST_MODE.REVEAL:
      return (
        <p>Reveal panels</p> // TODO: Reveal panel
      )
    case REQUEST_MODE.APPEAL:
      return <AppealPanel dispute={dispute} onAppeal={appeal} />
    default:
      return null
  }
})

export default DisputeDetail
