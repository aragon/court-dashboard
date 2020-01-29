import React, { useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import ANJIcon from '../../assets/IconANJButton.svg'
// import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import NoTasks from './NoTasks'
import { useConnectedAccount } from '../../providers/Web3'
import useFilteredTasks from '../../hooks/useFilteredTasks'

const Tasks = React.memo(({ onlyTable }) => {
  const connectedAccount = useConnectedAccount()

  const [screenIndex, setScreenIndex] = useState(0)
  const getScreenIndex = () => {
    if (connectedAccount) {
      return 0
    }
    return 1
  }
  const {
    tasks,
    error,
    selectedDateRange,
    handleSelectedDateRangeChange,
    selectedPhase,
    handleSelectedPhaseChange,
    openTasksNumber,
    jurorOpenTaskNumber,
    taskActionsString,
  } = useFilteredTasks(
    onlyTable ? getScreenIndex() : screenIndex,
    connectedAccount
  )

  const handleTabChange = screenIndex => {
    setScreenIndex(screenIndex)
  }

  return (
    <>
      {!onlyTable && (
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
      )}
      {/* Commented since we are not launching V1 with this component
      <TaskBox
        openTasks={openTasks}
        completedTasks={completedTasks}
        incompleteTasks={incompleteTasks}
      /> */}
      {!onlyTable && (
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
                <Tag limitDigits={4} label={jurorOpenTaskNumber} size="small" />
              </div>,
              <div>
                <span>All Tasks </span>
                <Tag limitDigits={4} label={openTasksNumber} size="small" />
              </div>,
            ]}
            selected={screenIndex}
            onChange={handleTabChange}
          />
        </div>
      )}
      {tasks.length === 0 && !error ? (
        <NoTasks />
      ) : (
        <TaskTable
          tasks={tasks}
          dateRangeFilter={selectedDateRange}
          onDateRangeChange={handleSelectedDateRangeChange}
          phaseFilter={selectedPhase}
          onPhaseChange={handleSelectedPhaseChange}
          phaseTypes={taskActionsString}
          fromDashboard
        />
      )}
    </>
  )
})

export default Tasks
