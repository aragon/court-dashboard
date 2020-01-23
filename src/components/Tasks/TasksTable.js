import React from 'react'
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
import TasksFilters from './TasksFilters'
import TaskStatus from './TaskStatus'
import TaskDueDate from './TaskDueDate'

const ENTRIES_PER_PAGE = 6

const TaskTable = React.memo(
  ({
    tasks,
    dateRangeFilter,
    onDateRangeChange,
    phaseFilter,
    onPhaseChange,
    phaseTypes,
  }) => {
    console.log('TASK TABLE ', tasks)
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
            {!compactMode && (
              <TasksFilters
                dateRangeFilter={dateRangeFilter}
                onDateRangeChange={onDateRangeChange}
                phaseFilter={phaseFilter}
                phaseChange={onPhaseChange}
                phaseTypes={phaseTypes}
              />
            )}
          </>
        }
        fields={[
          'Action',
          'Dispute',
          'Assigned to juror',
          'Status',
          'Due date',
        ]}
        entries={tasks}
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
  }
)

export default TaskTable
