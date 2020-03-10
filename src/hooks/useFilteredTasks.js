import { useCallback, useState, useMemo } from 'react'
import useTasks from './useTasks'
import { addressesEqual } from '../lib/web3-utils'
import { dayjs } from '../utils/date-utils'
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

function useFilteredTasks(jurorTasksSelected, connectedAccount) {
  const [selectedDateRange, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  const [selectedPhase, setSelectedPhase] = useState(UNSELECTED_PHASE)
  const [filtersSelected, setFiltersSelected] = useState(false)

  // If My Tasks is selected we need to only show ALL-COMMIT-REVEAL actions
  const TASKS_ACTIONS_TYPES_STRING = jurorTasksSelected
    ? TASKS_ACTIONS_TYPES.slice(0, 3).map(DisputesTypes.getTaskActionString)
    : TASKS_ACTIONS_TYPES.map(DisputesTypes.getTaskActionString)

  const { openTasks: tasks, fetching, error } = useTasks()

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

  const tasksToFilter = jurorTasksSelected ? jurorTasks : tasks

  const handleSelectedDateRangeChange = useCallback(
    range => {
      setFiltersSelected(range !== INITIAL_DATE_RANGE)
      setSelectedDateRange(range)
    },
    [setSelectedDateRange]
  )

  const handleSelectedPhaseChange = useCallback(index => {
    setFiltersSelected(index !== ALL_FILTER)
    setSelectedPhase(index || UNSELECTED_PHASE)
  }, [])

  const filteredTasks = useMemo(
    () =>
      tasksToFilter.filter(
        ({ phaseType, dueDate, open }) =>
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

  const handleClearFilters = useCallback(() => {
    setSelectedPhase(UNSELECTED_PHASE)
    setSelectedDateRange(INITIAL_DATE_RANGE)
    setFiltersSelected(false)
  }, [])

  const emptyFilterResults =
    !filteredTasks.length &&
    (selectedPhase > 1 || selectedDateRange.start || selectedDateRange.end)

  return {
    tasks: filteredTasks,
    fetching,
    error,
    filtersSelected,
    setFiltersSelected,
    emptyFilterResults,
    handleClearFilters,
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
