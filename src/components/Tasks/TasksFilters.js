import React from 'react'
import { DropDown, DateRangePicker, GU, SearchInput } from '@aragon/ui'

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
        placeholder="Actions"
        header="Actions"
        items={phaseTypes}
        selected={phaseFilter}
        onChange={onPhaseChange}
        width="128px"
      />
      <DateRangePicker
        startDate={dateRangeFilter.start}
        endDate={dateRangeFilter.end}
        onChange={onDateRangeChange}
      />
      <SearchInput
        css={`
          width: ${32 * GU}px;
        `}
        placeholder="Search"
        value=""
        onChange={() => {}}
      />
    </div>
  )
}

export default TasksFilters
