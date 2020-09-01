import React from 'react'
import {
  DataView,
  GU,
  Link,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import IdentityBadge from '../IdentityBadge'
import TasksFilters from './TasksFilters'
import TaskDueDate from './TaskDueDate'

import noResults from '../../assets/noResults.svg'

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
          : ['Action', 'Dispute', 'Assigned to juror', 'Due in']
      }
      entries={tasks}
      renderEntry={({ phase, disputeId, juror, dueDate }) => {
        return [
          <span
            css={`
              ${textStyle('body2')}
            `}
          >
            {phase}
          </span>,
          <Link href={`#/disputes/${disputeId}`} external={false}>
            Dispute #{disputeId}
          </Link>,
          <IdentityBadge entity={juror} />,
          <TaskDueDate dueDate={dueDate} />,
        ]
      }}
      status={emptyFilterResults ? 'empty-filters' : 'default'}
      emptyState={{
        'empty-filters': {
          displayLoader: false,
          title: 'No results found',
          subtitle: 'We couldn’t find any task matching your filter selection.',
          illustration: <img src={noResults} alt="" />,
          clearLabel: 'Clear filters',
        },
      }}
      onStatusEmptyClear={onClearFilters}
    />
  )
})

export default TaskTable
