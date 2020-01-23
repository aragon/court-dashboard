import React, { useMemo, useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import ANJIcon from '../../assets/anjButton.svg'
// import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import { useConnectedAccount } from '../../providers/Web3'
import useFilteredTasks from '../../hooks/useFilteredTasks'

const Tasks = React.memo(() => {
  const connectedAccount = useConnectedAccount()
  const [screenIndex, setScreenIndex] = useState(0)

  const {
    tasks,
    selectedDateRange,
    handleSelectedDateRangeChange,
    selectedPhase,
    handleSelectedPhaseChange,
    //  openTasksNumber,
    jurorOpenTaskNumber,
    taskActionsString,
  } = useFilteredTasks(screenIndex, connectedAccount)

  console.log('TASK COMPONENT ', tasks)

  // Testing
  const memoTasks = useMemo(() => {
    return tasks
  }, [tasks])

  console.log('memooo ', memoTasks)
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
      {/* Commented since we are not launching V1 with this component
      <TaskBox
        openTasks={openTasks}
        completedTasks={completedTasks}
        incompleteTasks={incompleteTasks}
      /> */}
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
              <Tag limitDigits={4} label={0} size="small" />
            </div>,
          ]}
          selected={screenIndex}
          onChange={handleTabChange}
        />
      </div>
      <TaskTable
        tasks={memoTasks}
        dateRangeFilter={selectedDateRange}
        onDateRangeChange={handleSelectedDateRangeChange}
        phaseFilter={selectedPhase}
        onPhaseChange={handleSelectedPhaseChange}
        phaseTypes={taskActionsString}
      />
    </>
  )
})

export default Tasks
