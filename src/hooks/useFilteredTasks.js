import React, { useState } from 'react'
import useRounds from '../hooks/useRounds'
import { addressesEqual } from '../lib/web3-utils'

const INITIAL_DATE_RANGE = { start: null, end: null }

function useFilteredTasks(tabIndex, connectedAccount) {
  const [page, setPage] = useState(0)
  const [filterSelected, setFilterSelected] = useState(false)
  const [selectedDate, setSelectedDateRange] = useState(INITIAL_DATE_RANGE)
  let jurorTasks
  const onlyOpen = tabIndex !== 2
  const jurorTasksSelected = tabIndex === 0
  const [tasks, openTasks] = useRounds(!filterSelected, onlyOpen, page)

  if (jurorTasksSelected) {
    jurorTasks = tasks
      ? tasks.filter(task =>
          task.juror === 'Anyone'
            ? false
            : addressesEqual(task.juror, connectedAccount)
        )
      : []
  }

  const handleSelectedDateRangeChange = React.useCallback(
    range => {
      setPage(0)
      setSelectedDateRange(range)
      setFilterSelected(true)
    },
    [setPage, setSelectedDateRange, setFilterSelected]
  )

  return {
    tasks: jurorTasksSelected ? jurorTasks : tasks,
    selectedDate,
    handleSelectedDateRangeChange,
    page,
    setPage,
    openTasks,
  }
}

export default useFilteredTasks
