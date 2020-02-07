import React, { useState } from 'react'
import { Button, GU, Header, Tabs, Tag } from '@aragon/ui'
import ANJIcon from '../../assets/IconANJButton.svg'
// import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import NoTasks from './NoTasks'
import NoMyTasks from './NoMyTasks'
import TasksLoading from '../Loading'
import ErrorLoading from '../ErrorLoading'
import { useConnectedAccount } from '../../providers/Web3'
import useFilteredTasks from '../../hooks/useFilteredTasks'

const Tasks = React.memo(({ onlyTable }) => {
  const connectedAccount = useConnectedAccount()

  const [screenIndex, setScreenIndex] = useState(0)

  const getMyTasksSelected = () => {
    if (onlyTable) {
      if (connectedAccount) {
        return true
      }
      return false
    }
    return screenIndex === 0
  }

  const myTasksSelected = getMyTasksSelected()

  const {
    tasks,
    fetching: tasksFetching,
    error: errorLoading,
    filtersSelected,
    setFiltersSelected,
    emptyFilterResults,
    handleClearFilters,
    selectedDateRange,
    handleSelectedDateRangeChange,
    selectedPhase,
    handleSelectedPhaseChange,
    openTasksNumber,
    jurorOpenTaskNumber,
    taskActionsString,
  } = useFilteredTasks(myTasksSelected, connectedAccount)

  const handleTabChange = screenIndex => {
    setFiltersSelected(false)
    handleClearFilters()
    setScreenIndex(screenIndex)
  }

  return (
    <div
      css={`
        padding-bottom: ${3 * GU}px;
      `}
    >
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

      {(() => {
        if (errorLoading) {
          return <ErrorLoading subject="tasks" error={errorLoading.message} />
        }
        if (tasksFetching) {
          return <TasksLoading />
        }

        if (!filtersSelected && tasks.length === 0) {
          return myTasksSelected ? <NoMyTasks /> : <NoTasks />
        }
        return (
          <TaskTable
            tasks={tasks}
            emptyFilterResults={emptyFilterResults}
            onClearFilters={handleClearFilters}
            dateRangeFilter={selectedDateRange}
            onDateRangeChange={handleSelectedDateRangeChange}
            phaseFilter={selectedPhase}
            onPhaseChange={handleSelectedPhaseChange}
            phaseTypes={taskActionsString}
            onlyTable={onlyTable}
          />
        )
      })()}
    </div>
  )
})

export default Tasks
