import React, { useState, useMemo } from 'react'
import useRounds from './useTasks'
import { addressesEqual } from '../lib/web3-utils'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/dispute-status-types'

const ALL_FILTER = 0
const UNSELECTED_PHASE = -1
const INITIAL_DATE_RANGE = { start: null, end: null }
const TASKS_ACTIONS_TYPES = [
  DisputesTypes.Phase.All,
  DisputesTypes.Phase.VotingPeriod,
  DisputesTypes.Phase.RevealVote,
  DisputesTypes.Phase.AppealRuling,
  DisputesTypes.Phase.ConfirmAppeal,
]

function useFilteredTasks(tabIndex, connectedAccount) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [selectedPhase, setSelectedPhase] = useState(UNSELECTED_PHASE)
  const jurorTasksSelected = tabIndex === 0
  const TASKS_ACTIONS_TYPES_STRING = jurorTasksSelected
    ? TASKS_ACTIONS_TYPES.slice(0, 3).map(DisputesTypes.getTaskActionString)
    : TASKS_ACTIONS_TYPES.map(DisputesTypes.getTaskActionString)

  const tasks = useRounds()

  const jurorTasks = useMemo(
    () =>
      tasks
        ? tasks.filter(task =>
            task.juror === 'Anyone'
              ? false
              : addressesEqual(task.juror, connectedAccount)
          )
        : [],
    [connectedAccount, tasks]
  )

  const handleSelectedDateRangeChange = React.useCallback(
    range => {
      setSelectedDateRange(range)
    },
    [setSelectedDateRange]
  )

  const handleSelectedPhaseChange = React.useCallback(index => {
    setSelectedPhase(index)
  }, [])

  const tasksToFilter = jurorTasksSelected ? jurorTasks : tasks

  const filteredTasks = useMemo(
    () =>
      tasksToFilter.filter(
        ({ phaseType, dueDate }) =>
          (selectedPhase === UNSELECTED_PHASE ||
            selectedPhase === ALL_FILTER ||
            phaseType === TASKS_ACTIONS_TYPES[selectedPhase]) &&
          (!selectedDateRange.start ||
            !selectedDateRange.end ||
            dayjs(dueDate).isBetween(
              dayjs(selectedDateRange.start).startOf('day'),
              dayjs(selectedDateRange.end).endOf('day'),
              '[]'
            ))
      ),
    [
      selectedDateRange.end,
      selectedDateRange.start,
      selectedPhase,
      tasksToFilter,
    ]
  )

  return {
    tasks: filteredTasks,
    selectedDateRange,
    handleSelectedDateRangeChange,
    selectedPhase,
    handleSelectedPhaseChange,
    openTasksNumber: tasks.length,
    jurorOpenTaskNumber: jurorTasks.length,
    taskActionsString: TASKS_ACTIONS_TYPES_STRING,
  }
}

export default useFilteredTasks
