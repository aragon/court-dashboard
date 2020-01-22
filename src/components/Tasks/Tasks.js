import React, { useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import ANJIcon from '../../assets/anjButton.svg'
import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import { useConnectedAccount } from '../../providers/Web3'
import useFilteredTasks from '../../hooks/useFilteredTasks'

const Tasks = () => {
  const connectedAccount = useConnectedAccount()
  const [screenIndex, setScreenIndex] = useState(0)
  // const [tasks, openTasks] = useRounds()

  const { tasks, page, setPage, openTasks } = useFilteredTasks(
    screenIndex,
    connectedAccount
  )
  console.log('TASK COMPONENT ', tasks)

  const completedTasks = 0
  const incompleteTasks = 0

  const handleTabChange = screenIndex => {
    setScreenIndex(screenIndex)
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
              <Tag limitDigits={4} label={0} size="small" />
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
      <TaskTable tasks={tasks} page={page} handlePageChange={setPage} />
    </>
  )
}

export default Tasks
