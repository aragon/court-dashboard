import React, { useCallback, useState } from 'react'
import { Bar, CardLayout, GU, useTheme } from '@aragon/ui'

import * as DisputesTypes from '../../types/dispute-status-types'
import DisputeCard from './DisputeCard'
import DisputeFilters from './DisputeFilters'
import MessageCard from '../MessageCard'
import DisputesLoading from './Loading'

import noDataSvg from '../../assets/noData.svg'
import noDraftSvg from '../../assets/noDraft.svg'

import dayjs from '../../lib/dayjs'

const ALL_FILTER = 0
const UNSELECTED_FILTER = -1
const INITIAL_DATE_RANGE = { start: null, end: null }
const DISPUTES_STATUS_TYPES = [
  DisputesTypes.Phase.All,
  DisputesTypes.Status.Open,
  DisputesTypes.Status.Closed,
]
const DISPUTES_STATUS_STRING = DISPUTES_STATUS_TYPES.map(
  DisputesTypes.convertToString
)

const DISPUTES_PHASE_TYPES = [
  DisputesTypes.Phase.All,
  DisputesTypes.Phase.Evidence,
  DisputesTypes.Phase.JuryDrafting,
  DisputesTypes.Phase.VotingPeriod,
  DisputesTypes.Phase.AppealRuling,
  DisputesTypes.Phase.ConfirmAppeal,
  DisputesTypes.Phase.ClaimRewards,
]
const DISPUTES_PHASE_STRING = DISPUTES_PHASE_TYPES.map(
  DisputesTypes.convertToString
)

const getFilteredDisputes = ({
  disputes = [],
  selectedDateRange,
  selectedStatus,
  selectedPhase,
}) => {
  return disputes.filter(
    ({ createdAt, reducedState, phase }) =>
      (selectedPhase === UNSELECTED_FILTER ||
        selectedPhase === ALL_FILTER ||
        phase === DISPUTES_PHASE_TYPES[selectedPhase]) &&
      (!selectedDateRange.start ||
        !selectedDateRange.end ||
        dayjs(createdAt).isBetween(
          dayjs(selectedDateRange.start).startOf('day'),
          dayjs(selectedDateRange.end).endOf('day'),
          '[]'
        )) &&
      (selectedStatus === UNSELECTED_FILTER ||
        selectedStatus === ALL_FILTER ||
        reducedState === DISPUTES_STATUS_TYPES[selectedStatus])
  )
}

function DisputeList({
  disputes,
  loading,
  myDisputeSelected,
  onSelectDispute,
}) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [selectedStatus, setSelectedStatus] = useState(UNSELECTED_FILTER)
  const [selectedPhase, setSelectedPhase] = useState(UNSELECTED_FILTER)

  const handleSelectedDateRangeChange = range => {
    setSelectedDateRange(range)
  }
  const handlePhaseChange = useCallback(index => {
    return setSelectedPhase(index)
  }, [])

  const handleStatusChange = useCallback(
    index => {
      setSelectedStatus(index)
    },
    [setSelectedStatus]
  )

  const filteredDisputes = getFilteredDisputes({
    disputes,
    selectedDateRange,
    selectedStatus,
    selectedPhase,
  })

  return (
    <div>
      <Bar
        css={`
          border-top: 0;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        `}
      >
        <DisputeFilters
          phaseTypes={DISPUTES_PHASE_STRING}
          statusTypes={DISPUTES_STATUS_STRING}
          dateRangeFilter={selectedDateRange}
          phaseFilter={selectedPhase}
          statusFilter={selectedStatus}
          onDateRangeChange={handleSelectedDateRangeChange}
          onPhaseChange={handlePhaseChange}
          onStatusChange={handleStatusChange}
        />
      </Bar>

      {(() => {
        if (loading) {
          return <DisputesLoading />
        }

        if (disputes.length === 0) {
          return myDisputeSelected ? <NoMyDisputes /> : <NoDisputes />
        }

        return (
          <CardLayout columnWidthMin={30 * GU} rowHeight={272}>
            {filteredDisputes.map(dispute => {
              return (
                <DisputeCard
                  key={dispute.id}
                  dispute={dispute}
                  onSelectDispute={onSelectDispute}
                />
              )
            })}
          </CardLayout>
        )
      })()}
    </div>
  )
}

const NoDisputes = () => {
  const title = 'No disputes yet!'
  return <MessageCard title={title} icon={noDataSvg} />
}

const NoMyDisputes = () => {
  const theme = useTheme()

  const title = 'You haven’t been drafted to arbitrate a dispute yet'
  const paragraph = (
    <span>
      The more{' '}
      <span
        css={`
          color: ${theme.help};
        `}
      >
        ANJ you activate
      </span>
      , more chances you have to be drafted to arbitrate a dispute.
    </span>
  )

  return <MessageCard title={title} paragraph={paragraph} icon={noDraftSvg} />
}

export default DisputeList
