import React from 'react'
import MainButton from '../MainButton'
import { Header } from '@aragon/ui'
import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import { getDummyTasks } from '../../mock-data'

const Tasks = () => {
  const tasks = getDummyTasks()

  return (
    <>
      <Header
        primary="Tasks"
        secondary={<MainButton primary label="Buy ANJ" onClick={() => {}} />}
      />
      <TaskBox />
      <TaskTable tasks={tasks} />
    </>
  )
}

export default Tasks
