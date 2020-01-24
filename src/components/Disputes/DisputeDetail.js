import React from 'react'
// import {
//   BackButton,
//   Bar,
//   Box,
//   // GU,
//   Header,
//   // SidePanel,
//   Split,
//   SyncIndicator,
// } from '@aragon/ui'
// import { useHistory } from 'react-router-dom'

// import DisputeInfo from './DisputeInfo'
// import DisputeEvidences from './DisputeEvidences'
// import DisputeTimeline from './DisputeTimeline'
// import NoEvidence from './NoEvidence'

// import { hexToAscii, toDate } from '../../lib/web3-utils'
import { useDisputeLogic } from '../../dispute-logic'
// import { DisputesStateProvider } from './DisputesStateProvider'
// import CommitPanel from './panels/CommitPanel'
// import AppealPanel from './panels/AppealPanel'

let previous = {}

const DisputeDetail = React.memo(function DisputeDetail({ match }) {
  console.log('')
  console.log('DETAAAAAAIL')
  console.log('match ', match === previous.match)

  previous = { match }
  // const history = useHistory()

  const { id: disputeId } = match.params
  const { dispute } = useDisputeLogic(disputeId)
  console.log('dispute ', dispute)

  // const { subject = {} } = dispute || {}

  // const evidences = useMemo(
  //   () =>
  //     (subject.evidence || []).map(evidence => ({
  //       ...evidence,
  //       data: hexToAscii(evidence.data),
  //       createdAt: toDate(evidence.createdAt),
  //     })),
  //   [subject]
  // )

  // const handleBack = useCallback(() => {
  //   history.push('/disputes')
  // }, [history])

  return null
  // <React.Fragment>
  //   <SyncIndicator visible={isSyncing} label="Loading dispute…" />

  //   <Header primary="Disputes" />
  //   <Bar>
  //     <BackButton onClick={handleBack} />
  //   </Bar>

  //   {!isSyncing && (
  //     <Split
  //       primary={
  //         <React.Fragment>
  //           <DisputeInfo
  //             dispute={dispute}
  //             onDraft={actions.draft}
  //             onRequestCommit={requests.commit}
  //             onReveal={actions.reveal}
  //             onLeak={actions.leak}
  //             onRequestAppeal={requests.appeal}
  //             onRequestConfirmAppeal={requests.confirmAppeal}
  //             onExecuteRuling={actions.executeRuling}
  //           />
  //           {evidences.length > 0 ? (
  //             <DisputeEvidences evidences={evidences} />
  //           ) : (
  //             <NoEvidence />
  //           )}
  //         </React.Fragment>
  //       }
  //       secondary={
  //         <React.Fragment>
  //           <Box heading="Dispute timeline" padding={0}>
  //             <DisputeTimeline dispute={dispute} />
  //           </Box>
  //         </React.Fragment>
  //       }
  //     />
  //   )}
  //   {/* <SidePanel
  //     title="title"
  //     opened={panelState.visible}
  //     onClose={panelState.requestClose}
  //     onTransitionEnd={panelState.endTransition}
  //   >
  //     <div
  //       css={`
  //         margin-top: ${2 * GU}px;
  //       `}
  //     >
  //       <PanelComponent
  //         dispute={dispute}
  //         requestMode={requestMode}
  //         actions={actions}
  //       />
  //     </div>
  //   </SidePanel> */}
  // </React.Fragment>
})

// const previousCall = {}

// const PanelComponent = React.memo(function PanelComponent({
//   dispute,
//   requestMode,
//   actions,
//   ...props
// }) {
//   console.log(
//     'EQUALS',
//     previousCall.dispute === dispute,
//     previousCall.requestMode === requestMode,
//     // previousCall.draft === actions.draft,
//     // previousCall.commit === actions.commit,
//     // previousCall.reveal === actions.reveal,
//     // previousCall.leak === actions.leak,
//     // previousCall.appeal === actions.appeal,
//     // previousCall.confirmAppeal === actions.confirmAppeal,
//     // previousCall.executeRuling === actions.executeRuling,
//     // previousCall.generateKeyCode === actions.generateKeyCode,
//     // previousCall.downloadKeyCode === actions.downloadKeyCode,
//     // previousCall.dispute === dispute
//     previousCall.actions === actions
//   )
//   previousCall = { dispute, requestMode, actions }
//   const { mode, data } = requestMode
//   const { commit, appeal, generateKeyCode } = actions
//   console.log('ACTIONS ', actions)
//   switch (mode) {
//     case REQUEST_MODE.COMMIT: {
//       const keyCode = generateKeyCode()
//       console.log('keyyyyyy ', keyCode)
//       return (
//         <CommitPanel
//           dispute={dispute}
//           commitment={data.commitment}
//           onCommit={commit}
//           // keyCode={keyCode}
//           // downloadKeyCode={downloadKeyCode}
//           {...props}
//         />
//       )
//     }
//     case REQUEST_MODE.REVEAL:
//       return (
//         <p>Reveal panels</p> // TODO: Reveal panel
//       )
//     case REQUEST_MODE.APPEAL:
//       return <AppealPanel dispute={dispute} onAppeal={appeal} />
//     default:
//       return null
//   }
// })

export default DisputeDetail
