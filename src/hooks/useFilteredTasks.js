import React, { useState } from 'react'
import useRounds from '../hooks/useRounds'
import { addressesEqual } from '../lib/web3-utils'
import dayjs from '../lib/dayjs'
import * as DisputesTypes from '../types/types'

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

const TASKS_ACTIONS_TYPES_STRING = TASKS_ACTIONS_TYPES.map(
  DisputesTypes.getTaskActionString
)

function useFilteredTasks(tabIndex, connectedAccount) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [selectedPhase, setSelectedPhase] = useState(UNSELECTED_PHASE)
  const jurorTasksSelected = tabIndex === 0

  const [tasks] = useRounds()

  const jurorTasks = tasks
    ? tasks.filter(task =>
        task.juror === 'Anyone'
          ? false
          : addressesEqual(task.juror, connectedAccount)
      )
    : []

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

  const filteredTasks = tasksToFilter.filter(
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
  )

  return {
    tasks: filteredTasks,
    selectedDateRange,
    handleSelectedDateRangeChange,
    selectedPhase,
    handleSelectedPhaseChange,
    // openTasksNumber,
    jurorOpenTaskNumber: jurorTasks.length,
    taskActionsString: TASKS_ACTIONS_TYPES_STRING,
  }
}

export default useFilteredTasks
