import React from 'react'
import { DropDown, DateRangePicker, GU } from '@aragon/ui'

const DisputeFilters = ({
  phaseTypes,
  statusTypes,
  dateRangeFilter,
  onDateRangeChange,
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
        // selected={disputeStatusFilter}
        // onChange={handleDisputeStatusFilterChange}
        items={phaseTypes}
        width="128px"
      />
      <DropDown
        header="Status"
        placeholder="Status"
        // selected={disputeStatusFilter}
        // onChange={handleDisputeStatusFilterChange}
        items={statusTypes}
        width="128px"
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
