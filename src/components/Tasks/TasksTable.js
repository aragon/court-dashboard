import React, { useMemo, useState } from 'react'
import {
  compareAsc,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
} from 'date-fns'
import {
  ContextMenu,
  DataView,
  DropDown,
  GU,
  IconApps,
  Link,
  Text,
  textStyle,
  theme,
  useViewport,
} from '@aragon/ui'

import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import TasksFilters from './TasksFilters'

const INITIAL_DATE_RANGE = { start: null, end: null }

const getFilteredTasks = ({ tasks, selectedDateRange }) => {
  return tasks.filter(
    ({ taskName, disputeId, priority, juror, dueDate }) =>
      !selectedDateRange.start ||
      !selectedDateRange.end ||
      isWithinInterval(new Date(dueDate), {
        start: startOfDay(selectedDateRange.start),
        end: endOfDay(selectedDateRange.end),
      })
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
        // Sort by date descending
        compareAsc(dateLeft, dateRight)
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
                    <Text
                      css={`
                        margin-left: ${GU}px;
                      `}
                    >
                      Actions
                    </Text>
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
      fields={[
        { label: 'Task', priority: 1 },
        { label: 'Dispute', priority: 2 },
        { label: 'Priority', priority: 3 },
        { label: 'Assigned to juror', priority: 4 },
        { label: 'Due date', priority: 5 },
      ]}
      entries={sortedTasks}
      renderEntry={({ taskName, disputeId, priority, juror, dueDate }) => {
        const formattedDate = format(dueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
        const hoursAndSec = format(dueDate, 'HH:mm')
        console.log('Hour ', hoursAndSec)
        return [
          <Text key={1}>{taskName}</Text>,
          <Link key={2}>#{disputeId}</Link>,
          <Text key={3}>{priority}</Text>,
          <LocalIdentityBadge key={4} connectedAccount entity={juror} />,
          <div key={5}>{`${format(
            formattedDate,
            'dd/MM/yy'
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
