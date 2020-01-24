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
import { DisputesStateProvider } from './DisputesStateProvider'
import CommitPanel from './panels/CommitPanel'
import AppealPanel from './panels/AppealPanel'

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  const history = useHistory()

  const { id: disputeId } = match.params
  const {
    actions,
    dispute,
    loading,
    requestMode,
    panelState,
    requests,
  } = useDisputeLogic(disputeId)

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

  const noDispute = !dispute && !loading

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
      <SyncIndicator visible={loading} label="Loading dispute…" />
      <Header primary="Disputes" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>
      <Split
        primary={
          <React.Fragment>
            <DisputeInfo
              dispute={dispute}
              loading={loading}
              onDraft={actions.draft}
              onRequestCommit={requests.commit}
              onReveal={actions.reveal}
              onLeak={actions.leak}
              onRequestAppeal={requests.appeal}
              onRequestConfirmAppeal={requests.confirmAppeal}
              onExecuteRuling={actions.executeRuling}
            />
            {(() => {
              if (loading) {
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
              {loading ? (
                <div css="height: 100px" />
              ) : (
                <DisputeTimeline dispute={dispute} />
              )}
            </Box>
          </React.Fragment>
        }
      />
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

function PanelComponent({ dispute, requestMode, actions, ...props }) {
  const { mode, data } = requestMode
  const { commit, appeal } = actions

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
    case REQUEST_MODE.REVEAL:
      return (
        <p>Reveal panels</p> // TODO: Reveal panel
      )
    case REQUEST_MODE.APPEAL:
      return <AppealPanel dispute={dispute} onAppeal={appeal} />
    default:
      return null
  }
}

export default function DisputeDetailWithSubscritpion(props) {
  return (
    <DisputesStateProvider>
      <DisputeDetail {...props} />
    </DisputesStateProvider>
  )
}
