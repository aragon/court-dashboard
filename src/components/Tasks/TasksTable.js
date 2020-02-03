import React from 'react'
import {
  DataView,
  GU,
  IdentityBadge,
  Link,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import TasksFilters from './TasksFilters'
import TaskStatus from './TaskStatus'
import TaskDueDate from './TaskDueDate'
import NoFilterResults from '../NoFilterResults'

const ENTRIES_PER_PAGE = 6

const TaskTable = React.memo(function TaskTable({
  tasks,
  emptyFilterResults,
  onClearFilters,
  dateRangeFilter,
  onDateRangeChange,
  phaseFilter,
  onPhaseChange,
  phaseTypes,
  onlyTable,
}) {
  const theme = useTheme()
  const { below } = useViewport()
  const compactMode = below('medium')

  return (
    <DataView
      entriesPerPage={ENTRIES_PER_PAGE}
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
          {!compactMode && !onlyTable && (
            <React.Fragment>
              <TasksFilters
                dateRangeFilter={dateRangeFilter}
                onDateRangeChange={onDateRangeChange}
                phaseFilter={phaseFilter}
                onPhaseChange={onPhaseChange}
                phaseTypes={phaseTypes}
              />
            </React.Fragment>
          )}
        </>
      }
      fields={
        emptyFilterResults
          ? []
          : ['Action', 'Dispute', 'Assigned to juror', 'Status', 'Due date']
      }
      entries={tasks}
      renderEntry={({ phase, disputeId, juror, open, dueDate }) => {
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
      status={emptyFilterResults ? 'empty-filters' : 'default'}
      statusEmptyFilters={
        <NoFilterResults
          onClearFilters={onClearFilters}
          paragraph="We couldn’t find any task matching your filter selection."
          noBorder
        />
      }
    />
  )
})

export default TaskTable
