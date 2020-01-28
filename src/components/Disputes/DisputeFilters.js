import React from 'react'
import { DropDown, DateRangePicker, GU } from '@aragon/ui'

const DisputeFilters = ({
  phaseTypes,
  statusTypes,
  dateRangeFilter,
  phaseFilter,
  statusFilter,
  onDateRangeChange,
  onPhaseChange,
  onStatusChange,
}) => {
  return (
    <div
      css={`
        height: ${8 * GU}px;
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        grid-gap: ${1 * GU}px;
        align-items: center;
        padding: 0 ${3 * GU}px;
      `}
    >
      <DropDown
        header="Phase"
        placeholder="Phase"
        selected={phaseFilter}
        onChange={onPhaseChange}
        items={phaseTypes}
      />
      <DropDown
        header="Status"
        placeholder="Status"
        selected={statusFilter}
        onChange={onStatusChange}
        items={statusTypes}
      />
      <DateRangePicker
        startDate={dateRangeFilter.start}
        endDate={dateRangeFilter.end}
        onChange={onDateRangeChange}
      />
    </div>
  )
}

export default DisputeFilters
