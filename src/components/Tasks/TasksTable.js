import React, { useMemo, useState } from 'react'
import {
  ContextMenu,
  DataView,
  DropDown,
  GU,
  IconApps,
  Link,
  textStyle,
  theme,
  useViewport,
} from '@aragon/ui'
import dayjs from '../../lib/dayjs'
import { dateFormat } from '../../utils/date-utils'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import TasksFilters from './TasksFilters'

const INITIAL_DATE_RANGE = { start: null, end: null }

const getFilteredTasks = ({ tasks, selectedDateRange }) => {
  return tasks.filter(
    ({ taskName, disputeId, priority, juror, dueDate }) =>
      !selectedDateRange.start ||
      !selectedDateRange.end ||
      dayjs(dueDate).isBetween(
        dayjs(selectedDateRange.start).startOf('day'),
        dayjs(selectedDateRange.end).endOf('day'),
        '[]'
      )
  )
}

const TaskTable = ({ tasks }) => {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [page, setPage] = useState(0)
  const { below } = useViewport()
  const compactMode = below('medium')

  const handleSelectedDateRangeChange = range => {
    setPage(0)
    setSelectedDateRange(range)
  }

  const filteredTasks = getFilteredTasks({
    tasks,
    selectedDateRange,
  })

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
      onPageChange={() => {}}
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

            <div css="text-align: right;">
              <DropDown
                placeholder={
                  <div
                    css={`
                      display: flex;
                    `}
                  >
                    <IconApps />
                    <span
                      css={`
                        ${textStyle('body2')}
                      `}
                    >
                      Actions
                    </span>
                  </div>
                }
                header="Actions"
                items={[]}
                onChange={() => {}}
                width="162px"
              />
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
      fields={['Task', 'Dispute', 'Priority', 'Assigned to juror', 'Due date']}
      entries={sortedTasks}
      renderEntry={({ taskName, disputeId, priority, juror, dueDate }) => {
        const formattedDate = dateFormat(dueDate, 'YYYY-MM-DDTHH:mm:ssZ')
        const hoursAndSec = dateFormat(dueDate, 'HH:mm')
        return [
          <span
            css={`
              ${textStyle('body2')}
            `}
          >
            {taskName}
          </span>,
          <Link>#{disputeId}</Link>,
          <span
            css={`
              ${textStyle('body2')}
            `}
          >
            {priority}
          </span>,
          <LocalIdentityBadge key={4} connectedAccount entity={juror} />,
          <div key={5}>{`${dateFormat(
            formattedDate,
            'DD/MM/YY'
          )} at ${hoursAndSec} - Term `}</div>,
        ]
      }}
      renderEntryActions={() => (
        <ContextMenu zIndex={1}>
          {/* <ContextMenuItem  />
          <ContextMenuItem /> */}
        </ContextMenu>
      )}
      onSelectEntries={() => {}}
    />
  )
}

export default TaskTable
