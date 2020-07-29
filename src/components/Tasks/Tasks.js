import React, { useState } from 'react'
import { GU, Tabs, Tag } from '@aragon/ui'

import NoTasks from './NoTasks'
import NoMyTasks from './NoMyTasks'
import TaskTable from './TasksTable'
import TasksLoading from '../LoadingCard'
import TitleHeader from '../TitleHeader'
import ErrorLoading from '../Errors/ErrorLoading'
import { useWallet } from '../../providers/Wallet'
import useFilteredTasks from '../../hooks/useFilteredTasks'

const Tasks = React.memo(({ onlyTable }) => {
  const wallet = useWallet()

  const [screenIndex, setScreenIndex] = useState(0)

  const getMyTasksSelected = () => {
    if (onlyTable) {
      if (wallet.account) {
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
  } = useFilteredTasks(myTasksSelected, wallet.account)

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
      {!onlyTable && <TitleHeader title="Tasks" />}
      {/* Commented since we are not launching V1 with this component
      <TaskBox
        openTasks={openTasks}
        completedTasks={completedTasks}
        incompleteTasks={incompleteTasks}
      /> */}
      {!onlyTable && (
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
      )}

      {(() => {
        if (errorLoading) {
          return (
            <ErrorLoading subject="tasks" errors={[errorLoading.message]} />
          )
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
