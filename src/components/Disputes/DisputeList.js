import React, { useState } from 'react'
import { Bar, CardLayout, GU } from '@aragon/ui'
import * as DisputesTypes from './types'
import DisputeCard from './DisputeCard'
import DisputeFilters from './DisputeFilters'
import dayjs from '../Lib/dayjs'

const INITIAL_DATE_RANGE = { start: null, end: null }
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

const getFilteredDisputes = ({ disputes, selectedDateRange }) => {
  return disputes.filter(
    ({ createdAt }) =>
      !selectedDateRange.start ||
      !selectedDateRange.end ||
      dayjs(createdAt).isBetween(
        dayjs(selectedDateRange.start).startOf('day'),
        dayjs(selectedDateRange.end).endOf('day'),
        '[]'
      )
  )
}

function DisputeList({ disputes, selectDispute }) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)

  const handleSelectedDateRangeChange = range => {
    setSelectedDateRange(range)
  }

  const filteredDisputes = getFilteredDisputes({
    disputes,
    selectedDateRange,
  })

  return (
    <div>
      <Bar>
        <DisputeFilters
          phaseTypes={DISPUTES_PHASE_STRING}
          statusTypes={DISPUTES_STATUS_STRING}
          dateRangeFilter={selectedDateRange}
          onDateRangeChange={handleSelectedDateRangeChange}
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
