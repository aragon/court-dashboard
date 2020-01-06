import React from 'react'
import { Button, Header, GU } from '@aragon/ui'
import ANJIcon from '../../assets/anjButton.svg'

import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
import { tasks } from '../../mock-data'

const Tasks = () => {
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
      <TaskBox />
      <TaskTable tasks={tasks} />
    </>
  )
}

export default Tasks
