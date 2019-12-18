import React, { useCallback, useMemo, useState } from 'react'
import * as DisputesTypes from './types'
import { GU, Header, Tabs, Tag } from '@aragon/ui'
import MainButton from '../MainButton'
import DisputeDetail from './DisputeDetail'
import DisputeList from './DisputeList'
import { useSubscription } from 'urql'
import { AllDisputes } from '../../queries/disputes'
import { disputes } from '../../mock-data'

const DISPUTES_STATUS_TYPES = [
  DisputesTypes.Status.Open,
  DisputesTypes.Status.Closed,
]
const DISPUTES_STATUS_STRING = DISPUTES_STATUS_TYPES.map(
  DisputesTypes.convertToString
)

const DISPUTES_PHASE_TYPES = [
  DisputesTypes.Phase.EvidenceSubmission,
  DisputesTypes.Phase.JuryDrafting,
  DisputesTypes.Phase.VotingPeriod,
  DisputesTypes.Phase.AppealRuling,
  DisputesTypes.Phase.ConfirmAppeal,
  DisputesTypes.Phase.ClaimRewards,
]
const DISPUTES_PHASE_STRING = DISPUTES_PHASE_TYPES.map(
  DisputesTypes.convertToString
)

const useSelectedDispute = disputes => {
  const [selectedDisputeId, setSelectedDisputeId] = useState(-1)

  const selectDispute = disputeId => setSelectedDisputeId(disputeId)

  const selectedDispute = useMemo(
    () => disputes.find(dispute => dispute.id === selectedDisputeId) || null,
    [disputes, selectedDisputeId]
  )

  return [selectedDispute, selectDispute]
}

function Disputes() {
  const [selectedDispute, selectDispute] = useSelectedDispute(disputes)
  const [reducedDisputes, setReducedDispute] = useState([])

  // First argument is the last result from the query , second argument is the current response
  // See https://formidable.com/open-source/urql/docs/basics/#subscriptions - Usage with hooks
  const handleSubscription = (disputes = reducedDisputes, response) => {
    /* I am not completely sure if the subscription response is always only one element, in the response argument we get all the disputes 
  not only the new ones  so i calculating the difference between the state and the incoming disputes in order to avoid reducing all the disputes
  again with each new dispute, but maybe iterating both arrays and comparing is worst in terms of performance?
  */

    if (disputes.length === 0) {
      return setReducedDispute(
        response.disputes.map(dispute => {
          return {
            ...dispute,
            createdAt: parseInt(dispute.createdAt, 10) * 1000,
            reducedState:
              dispute.state === 'Ruled'
                ? DisputesTypes.Status.Closed
                : DisputesTypes.Status.Open,
            rounds: dispute.rounds.map(round => {
              return {
                ...round,
                state: DisputesTypes.convertFromString(round.state),
              }
            }),
          }
        })
      )
    }
    const disputeDifference = response.disputes.filter(
      dispute => !disputes.some(dispute2 => dispute2.id === dispute.id)
    )
    const reducedDifference = disputeDifference.map(dispute => {
      return {
        ...dispute,
        createdAt: parseInt(dispute.createdAt, 10) * 1000,
        reducedState:
          dispute.state === 'Ruled'
            ? DisputesTypes.Status.Closed
            : DisputesTypes.Status.Open,
        rounds: dispute.rounds.map(round => {
          return {
            ...round,
            state: DisputesTypes.convertFromString(round.state),
          }
        }),
      }
    })
    return setReducedDispute(...reducedDisputes, ...reducedDifference)
  }
  const [res] = useSubscription(
    {
      query: AllDisputes,
    },
    handleSubscription
  )

  const handleBack = useCallback(() => {
    selectDispute(-1)
  }, [selectDispute])

  if (res.error !== undefined) {
    return <p>res.error.message</p>
  }

  if (reducedDisputes === undefined) {
    return <p>No new Disputes</p>
  }

  return (
    <React.Fragment>
      <Header
        primary="Disputes"
        secondary={!selectedDispute && <MainButton label="Buy ANJ" />}
      />
      {selectedDispute ? (
        <DisputeDetail dispute={selectedDispute} onBack={handleBack} />
      ) : (
        <>
          <div>
            <Tabs
              css={`
                margin-bottom: 0px;
              `}
              items={[
                <div>
                  <span>All disputes </span>
                  <Tag
                    limitDigits={4}
                    label={reducedDisputes.length}
                    size="small"
                  />
                </div>,
                <div>
                  <span>My disputes </span>
                  <Tag
                    limitDigits={4}
                    label={reducedDisputes.length}
                    size="small"
                  />
                </div>,
              ]}
              selected={0}
              onChange={() => {}}
            />
          </div>
          <div
            css={`
              margin-top: -${GU * 1}px;
              width: 100%;
            `}
          >
            <DisputeList
              disputes={reducedDisputes}
              selectDispute={selectDispute}
              statusTypes={DISPUTES_STATUS_STRING}
              phaseTypes={DISPUTES_PHASE_STRING}
              // filteredDisputes={filteredDisputes}
              // disputeStatusFilter={disputeStatusFilter}
              // handleDisputeStatusFilterChange={handleDisputeStatusFilterChange}
              // disputeAppFilter={disputeAppFilter}
              // handleDisputeAppFilterChange={handleDisputeAppFilterChange}
              // handleClearFilters={handleClearFilters}
              // executionTargets={executionTargets}
            />
          </div>
        </>
      )}
    </React.Fragment>
  )
}

// const TabsWrapper = styled.div`
//   margin: 0 -${Main.HORIZONTAL_PADDING}px ${3 * GU}px;
// `

export default Disputes
