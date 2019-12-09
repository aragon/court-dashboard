import React from 'react'
import { DropDown, DateRangePicker, GU, SearchInput } from '@aragon/ui'

const TasksFilters = ({ dateRangeFilter, onDateRangeChange }) => {
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
        placeholder="All Tasks"
        header="All Tasks"
        items={[]}
        onChange={() => {}}
        width="128px"
      />
      <DropDown
        placeholder="Status"
        header="Status"
        items={[]}
        onChange={() => {}}
        width="128px"
      />
      <DropDown
        placeholder="Priority"
        header="Priority"
        items={[]}
        onChange={() => {}}
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
