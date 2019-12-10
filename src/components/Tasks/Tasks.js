import React from 'react'
import { Header } from '@aragon/ui'

import MainButton from '../MainButton'
import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import { tasks } from '../../mock-data'

const Tasks = () => {
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
