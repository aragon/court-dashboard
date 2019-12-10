import React, { useMemo, useState } from 'react'
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
import dayjs from '../Lib/dayjs'
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
        dayjs(dateLeft).isAfter(dayjs(dateRight)) ? 1 : -1
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
        const formattedDate = dayjs(dueDate).format('YYYY-MM-DDTHH:mm:ssZ')
        const hoursAndSec = dayjs(dueDate).format('HH:mm')
        return [
          <Text>{taskName}</Text>,
          <Link>#{disputeId}</Link>,
          <Text>{priority}</Text>,
          <LocalIdentityBadge key={4} connectedAccount entity={juror} />,
          <div key={5}>{`${dayjs(formattedDate).format(
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
