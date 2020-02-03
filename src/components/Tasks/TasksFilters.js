import React from 'react'
import { DropDown, DateRangePicker, GU } from '@aragon/ui'

const TasksFilters = ({
  dateRangeFilter,
  onDateRangeChange,
  phaseFilter,
  onPhaseChange,
  phaseTypes,
}) => {
  return (
    <div
      css={`
        margin-bottom: ${1 * GU}px;
        display: grid;
        grid-gap: ${1.5 * GU}px;
        grid-template-columns: auto auto auto 1fr auto;
      `}
    >
      <DropDown
        placeholder="Type"
        header="Type"
        items={phaseTypes}
        selected={phaseFilter}
        onChange={onPhaseChange}
        width={`${16 * GU}px`}
      />
      <DateRangePicker
        startDate={dateRangeFilter.start}
        endDate={dateRangeFilter.end}
        onChange={onDateRangeChange}
      />
    </div>
  )
}

export default TasksFilters
