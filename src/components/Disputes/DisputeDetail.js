import React, { useCallback, useEffect, useMemo } from 'react'
import { BackButton, Bar, Box, GU, Header, SidePanel, Split } from '@aragon/ui'
import { useHistory } from 'react-router-dom'
import { utils as EthersUtils } from 'ethers'

import DisputeInfo from './DisputeInfo'
import DisputeEvidences from './DisputeEvidences'
import DisputeTimeline from './DisputeTimeline'
import NoEvidence from './NoEvidence'
import CommitPanel from './panels/CommitPanel'
import RevealPanel from './panels/RevealPanel'
import AppealPanel from './panels/AppealPanel'

import { toDate } from '../../lib/web3-utils'
import { Status as DisputeStatus } from '../../types/dispute-status-types'
import { useDisputeLogic, REQUEST_MODE } from '../../dispute-logic'

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

  const creatorAddress = dispute?.subject?.id

  const evidenceList = dispute?.evidences

  const evidences = useMemo(
    () =>
      (evidenceList || []).map(evidence => ({
        ...evidence,
        createdAt: toDate(evidence.createdAt),
        data: EthersUtils.toUtf8String(evidence.data),
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

  const DisputeInfoComponent = (
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
  )

  return (
    <React.Fragment>
      <Header primary="Disputes" />
      <Bar>
        <BackButton onClick={handleBack} />
      </Bar>
      {dispute?.status === DisputeStatus.Voided ? (
        DisputeInfoComponent
      ) : (
        <Split
          primary={
            <React.Fragment>
              {DisputeInfoComponent}
              {(() => {
                if (disputeFetching) {
                  return null
                }
                if (evidences.length === 0) {
                  return <NoEvidence />
                }
                return (
                  // TODO- in next PR will get plaintiff and deffendant from the dispute
                  <DisputeEvidences
                    evidences={evidences}
                    plaintiff={creatorAddress}
                    defendant=""
                  />
                )
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
      )}
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

  if (mode === REQUEST_MODE.COMMIT)
    return <>Commit your vote on dispute #{disputeId}</>

  if (mode === REQUEST_MODE.REVEAL)
    return <>Reveal your vote on dispute #{disputeId}</>

  if (mode === REQUEST_MODE.APPEAL) {
    if (data.confirm) {
      return <>Confirm an appeal on dispute #{disputeId}</>
    }

    return <>Appeal ruling on dispute #{disputeId}</>
  }

  return null
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

  if (mode === REQUEST_MODE.COMMIT) {
    return (
      <CommitPanel
        dispute={dispute}
        commitment={data.commitment}
        onCommit={commit}
        {...props}
      />
    )
  }

  if (mode === REQUEST_MODE.REVEAL) {
    return <RevealPanel dispute={dispute} onReveal={reveal} {...props} />
  }

  if (mode === REQUEST_MODE.APPEAL) {
    return (
      <AppealPanel
        dispute={dispute}
        onApproveFeeDeposit={approveFeeDeposit}
        onAppeal={data.confirm ? confirmAppeal : appeal}
        confirm={data.confirm}
        {...props}
      />
    )
  }

  return null
}

export default DisputeDetail
