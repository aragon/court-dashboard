import React, { useState } from 'react'
import { Bar, CardLayout, GU } from '@aragon/ui'
import * as DisputesTypes from './types'
import DisputeCard from './DisputeCard'
import DisputeFilters from './DisputeFilters'
import dayjs from '../Lib/dayjs'

const UNSELECTED_FILTER = -1
const INITIAL_DATE_RANGE = { start: null, end: null }
const DISPUTES_STATUS_TYPES = [
  DisputesTypes.Status.Open,
  DisputesTypes.Status.Closed,
]
const DISPUTES_STATUS_STRING = DISPUTES_STATUS_TYPES.map(
  DisputesTypes.convertToString
)

const DISPUTES_PHASE_TYPES = [
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
  disputes,
  selectedDateRange,
  selectedStatus,
  selectedPhase,
}) => {
  console.log('selected Filter Phase', selectedPhase)
  return disputes.filter(
    ({ createdAt, reducedState, currentPhase }) =>
      (selectedPhase === UNSELECTED_FILTER ||
        currentPhase === DISPUTES_PHASE_TYPES[selectedPhase]) &&
      (!selectedDateRange.start ||
        !selectedDateRange.end ||
        dayjs(createdAt).isBetween(
          dayjs(selectedDateRange.start).startOf('day'),
          dayjs(selectedDateRange.end).endOf('day'),
          '[]'
        )) &&
      (selectedStatus === UNSELECTED_FILTER ||
        reducedState === DISPUTES_STATUS_TYPES[selectedStatus])
  )
}

function DisputeList({ disputes, selectDispute }) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [selectedStatus, setSelectedStatus] = useState(UNSELECTED_FILTER)
  const [selectedPhase, setSelectedPhase] = useState(UNSELECTED_FILTER)

  const handleSelectedDateRangeChange = range => {
    setSelectedDateRange(range)
  }
  const handlePhaseChange = React.useCallback(index => {
    console.log('INDEXXXX ', index)
    console.log('Dispute phase type', DISPUTES_PHASE_TYPES[index])
    return setSelectedPhase(index)
  }, [])

  const handleStatusChange = React.useCallback(
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

  const find = disputes.map(
    ({ currentPhase }) => currentPhase === DISPUTES_PHASE_TYPES[0]
  )
  console.log('FIND ', find)
  return (
    <div>
      <Bar>
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
      <CardLayout columnWidthMin={30 * GU} rowHeight={272}>
        {filteredDisputes.map(dispute => {
          return (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              selectDispute={selectDispute}
            />
          )
        })}
      </CardLayout>
    </div>
  )
}

export default DisputeList
