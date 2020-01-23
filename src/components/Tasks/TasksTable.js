import React from 'react'
import styled from 'styled-components'
import {
  ContextMenu,
  ContextMenuItem,
  DataView,
  GU,
  IconLabel,
  IconShare,
  IdentityBadge,
  Link,
  textStyle,
  useTheme,
  useViewport,
} from '@aragon/ui'
import TasksFilters from './TasksFilters'
import TaskStatus from './TaskStatus'
import TaskDueDate from './TaskDueDate'

const ENTRIES_PER_PAGE = 6

const TaskTable = React.memo(function TaskTable({
  tasks,
  dateRangeFilter,
  onDateRangeChange,
  phaseFilter,
  onPhaseChange,
  phaseTypes,
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
          {!compactMode && (
            <TasksFilters
              dateRangeFilter={dateRangeFilter}
              onDateRangeChange={onDateRangeChange}
              phaseFilter={phaseFilter}
              onPhaseChange={onPhaseChange}
              phaseTypes={phaseTypes}
            />
          )}
        </>
      }
      fields={['Action', 'Dispute', 'Assigned to juror', 'Status', 'Due date']}
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
          <ContextMenuItem onClick={() => {}}>
            <IconWrapper theme={theme}>
              <IconShare />
            </IconWrapper>
            <div
              css={`
                ${textStyle('body2')}
                margin-left: 15px
              `}
            >
              View dispute
            </div>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => {}}>
            <IconWrapper theme={theme}>
              <IconLabel />
            </IconWrapper>
            <div
              css={`
                ${textStyle('body2')}
                margin-left: 15px
              `}
            >
              Add custom label
            </div>
          </ContextMenuItem>
        </ContextMenu>
      )}
    />
  )
})

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => {
    return theme.textSecondary
  }};
`
export default TaskTable
