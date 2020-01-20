import React, { useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import ANJIcon from '../../assets/anjButton.svg'

import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import useRounds from '../../hooks/useRounds'
import { useConnectedAccount } from '../../providers/Web3'

const Tasks = () => {
  const connectedAccount = useConnectedAccount()
  console.log('connected account ', connectedAccount)
  const [screenIndex, setScreenIndex] = useState(0)
  const [tasks, openTasks] = useRounds()
  const jurorTasks = tasks
    ? tasks.filter(task => task.juror === connectedAccount)
    : []
  console.log('Tasks ', tasks)
  const completedTasks = 0
  const incompleteTasks = 0

  const handleTabChange = screenIndex => {
    setScreenIndex(screenIndex)
  }

  const getTasksByTab = screenIndex => {
    if (screenIndex === 0) {
      return jurorTasks
    }
    if (screenIndex === 1) {
      return tasks
    }
  }

  return (
    <>
      <Header
        primary="Tasks"
        secondary={
          <Button
            icon={
              <div
                css={`
                  display: flex;
                  height: ${GU * 3}px;
                  width: ${GU * 3}px;
                  margin-right: -6px;
                `}
              >
                <img
                  src={ANJIcon}
                  css={`
                    margin: auto;
                    width: 14px;
                    height: 16px;
                  `}
                />
              </div>
            }
            label="Buy ANJ"
            display="all"
            mode="strong"
          />
        }
      />
      <TaskBox
        openTasks={openTasks}
        completedTasks={completedTasks}
        incompleteTasks={incompleteTasks}
      />
      <div
        css={`
          margin-top: ${2 * GU}px;
        `}
      >
        <Tabs
          css={`
            margin-bottom: 0px;
          `}
          items={[
            <div>
              <span>My Tasks </span>
              <Tag limitDigits={4} label={jurorTasks.length} size="small" />
            </div>,
            <div>
              <span>All Tasks </span>
              <Tag limitDigits={4} label={openTasks} size="small" />
            </div>,
            <div>
              <span>Past Tasks </span>
              <Tag limitDigits={4} label={0} size="small" />
            </div>,
          ]}
          selected={screenIndex}
          onChange={handleTabChange}
        />
      </div>
      <TaskTable tasks={getTasksByTab(screenIndex)} />
    </>
  )
}

export default Tasks
