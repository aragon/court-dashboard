import React from 'react'
import { Button, Header } from '@aragon/ui'

import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import { tasks } from '../../mock-data'

const Tasks = () => {
  return (
    <>
      <Header
        primary="Tasks"
        secondary={<Button label="Buy ANJ" onClick={() => {}} />}
      />
      <TaskBox />
      <TaskTable tasks={tasks} />
    </>
  )
}

export default Tasks
