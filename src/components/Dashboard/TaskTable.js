import React, { useMemo, useState } from 'react'
import {
  ContextMenu,
  DataView,
  DateRangePicker,
  GU,
  Link,
  Text,
  textStyle,
  theme,
  useViewport,
} from '@aragon/ui'
import dayjs from '../Lib/dayjs'
import LocalIdentityBadge from '../LocalIdentityBadge/LocalIdentityBadge'
import { addressesEqual } from '../Lib/web3-utils'

const ENTRIES_PER_PAGE = 5
const INITIAL_DATE_RANGE = { start: null, end: null }

const getFilteredTasks = ({ tasks, connectedAccount, selectedDateRange }) => {
  return tasks.filter(
    ({ taskName, disputeId, priority, juror, dueDate }) =>
      (connectedAccount === '' || addressesEqual(juror, connectedAccount)) &&
      (!selectedDateRange.start ||
        !selectedDateRange.end ||
        dayjs(dueDate).isBetween(
          dayjs(selectedDateRange.start).startOf('day'),
          dayjs(selectedDateRange.end).endOf('day'),
          '[]'
        ))
  )
}

const TaskTable = ({ tasks, connectedAccount }) => {
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
    connectedAccount,
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
      entriesPerPage={ENTRIES_PER_PAGE}
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

            {!compactMode && (
              <div css="text-align: right;">
                <DateRangePicker
                  startDate={selectedDateRange.start}
                  endDate={selectedDateRange.end}
                  onChange={handleSelectedDateRangeChange}
                />
              </div>
            )}
          </div>
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
          )} at ${hoursAndSec}`}</div>,
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
}

export default TaskTable
