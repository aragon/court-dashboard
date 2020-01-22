import React, { useMemo, useState } from 'react'
import {
  ContextMenu,
  DataView,
  GU,
  IdentityBadge,
  Link,
  textStyle,
  theme,
  useViewport,
} from '@aragon/ui'
import dayjs from '../../lib/dayjs'
import TasksFilters from './TasksFilters'
import TaskStatus from './TaskStatus'
import TaskDueDate from './TaskDueDate'

const INITIAL_DATE_RANGE = { start: null, end: null }
const ENTRIES_PER_PAGE = 6

const getFilteredTasks = ({ tasks, selectedDateRange }) => {
  return tasks.filter(
    ({ taskName, disputeId, juror, dueDate }) =>
      !selectedDateRange.start ||
      !selectedDateRange.end ||
      dayjs(dueDate).isBetween(
        dayjs(selectedDateRange.start).startOf('day'),
        dayjs(selectedDateRange.end).endOf('day'),
        '[]'
      )
  )
}

const TaskTable = React.memo(({ tasks, page, handlePageChange }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const { below } = useViewport()
  const compactMode = below('medium')
  const handleSelectedDateRangeChange = range => {
    setSelectedDateRange(range)
  }

  const filteredTasks = getFilteredTasks({
    tasks,
    selectedDateRange,
  })

  console.log('FILTERED ', filteredTasks)
  const sortedTasks = useMemo(
    () =>
      filteredTasks.sort(({ dueDate: dateLeft }, { dueDate: dateRight }) =>
        // Sort by date ascending
        dayjs(dateLeft).isAfter(dayjs(dateRight))
          ? 1
          : dayjs(dateLeft).isSame(dayjs(dateRight))
          ? 0
          : -1
      ),
    [filteredTasks]
  )

  return (
    <DataView
      page={page}
      entriesPerPage={ENTRIES_PER_PAGE}
      onPageChange={handlePageChange}
      heading={
        <>
          <div
            css={`
              padding-bottom: ${2 * GU}px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                color: ${theme.content};
                ${textStyle('body1')};
              `}
            >
              Upcoming tasks
            </div>
          </div>
          {!compactMode && (
            <TasksFilters
              dateRangeFilter={selectedDateRange}
              onDateRangeChange={handleSelectedDateRangeChange}
            />
          )}
        </>
      }
      fields={['Action', 'Dispute', 'Assigned to juror', 'Status', 'Due date']}
      entries={sortedTasks}
      renderEntry={({ phase, disputeId, juror, open, dueDate }) => {
        // const formattedDate = dayjs(dueDate).format('YYYY-MM-DDTHH:mm:ssZ')
        // const hoursAndSec = dayjs(dueDate).format('HH:mm')
        return [
          <span
            css={`
              ${textStyle('body2')}
            `}
          >
            {phase}
          </span>,
          <Link href={`/disputes/${disputeId}`}>Dispute #{disputeId}</Link>,
          <IdentityBadge entity={juror} />,

          <TaskStatus status={open} />,
          <TaskDueDate dueDate={dueDate} />,
        ]
      }}
      renderEntryActions={() => (
        <ContextMenu zIndex={1}>
          {/* <ContextMenuItem  />
          <ContextMenuItem /> */}
        </ContextMenu>
      )}
    />
  )
})

export default TaskTable
