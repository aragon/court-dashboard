import React from 'react'
import { Box, GU, useViewport } from '@aragon/ui'
import TaskAmounts from './TasksAmounts'

function TasksBox({ openTasks, completedTasks, incompleteTasks }) {
  const { below } = useViewport()
  const compactMode = below('medium')
  const tasks = [
    { status: 'Open', amount: openTasks },
    { status: 'Completed', amount: completedTasks },
    { status: 'Incomplete', amount: incompleteTasks },
  ]
  return (
    <Box heading="Overview">
      <div
        css={`
          /*
            * translate3d() fixes an issue on recent Firefox versions where the
            * scrollbar would briefly appear on top of everything (including the
            * sidepanel overlay).
            */
          min-height: 70px;
          transform: translate3d(0, 0, 0);
          overflow-x: auto;
        `}
      >
        <ul
          css={`
            list-style: none;
            display: flex;
            ${compactMode
              ? `
                  flex-direction: column;
                  padding: ${1 * GU}px 0;
                `
              : ''}
          `}
        >
          {tasks.map(({ amount, status }, index) => (
            <li
              key={index}
              css={`
                display: block;
                min-width: ${20 * GU}px;
                ${compactMode ? `margin-bottom: ${3 * GU}px;` : ''}
                &:last-of-type {
                  min-width: unset;
                  margin-bottom: 0;
                }
              `}
            >
              <TaskAmounts amount={amount} status={status} />
            </li>
          ))}
        </ul>
      </div>
    </Box>
  )
}

export default TasksBox
