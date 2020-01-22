import React, { useCallback, useMemo } from 'react'
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
import { DisputesStateProvider } from './DisputesStateProvider'
import CommitPanel from './panels/CommitPanel'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()

  const { id: disputeId } = match.params
  const {
    actions,
    dispute,
    isSyncing,
    requestMode,
    panelState,
    requests,
  } = useDisputeLogic(disputeId)

  const { subject = {} } = dispute || {}

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
      <SyncIndicator visible={isSyncing} label="Loading dispute…" />

      <Header primary="Disputes" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>

      {!isSyncing && (
        <Split
          primary={
            <React.Fragment>
              <DisputeInfo
                dispute={dispute}
                onDraft={actions.draft}
                onRequestCommit={requests.commit}
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
              <Box heading="Dispute timeline" padding={0}>
                <DisputeTimeline dispute={dispute} />
              </Box>
            </React.Fragment>
          }
        />
      )}
      <SidePanel
        title={`Commit your vote on dispute #${disputeId}`}
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

function PanelComponent({ dispute, requestMode, actions, ...props }) {
  const { mode, data } = requestMode
  const { commit } = actions

  switch (mode) {
    case REQUEST_MODE.COMMIT:
      return (
        <CommitPanel
          dispute={dispute}
          commitment={data.commitment}
          onCommit={commit}
          {...props}
        />
      )
  }
}

export default function DisputeDetailWithSubscritpion(props) {
  return (
    <DisputesStateProvider>
      <DisputeDetail {...props} />
    </DisputesStateProvider>
  )
}
