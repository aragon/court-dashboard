import React from 'react'
import { Button, GU, Header, Tabs } from '@aragon/ui'
import ANJIcon from '../../assets/anjButton.svg'

import TaskBox from './TasksBox'
import TaskTable from './TasksTable'
// mport { tasks } from '../../mock-data'
import useRounds from '../../hooks/useRounds'

const Tasks = () => {
  const [tasks] = useRounds()
  // const tasks = rounds.map(round => {
  //   return round.jurors.map(juror => {
  //     return {
  //       id: round.id,
  //       state: round.state,
  //       createdAt: round.createdAt,
  //       taskName: round.phase,
  //       dueDate: round.nextTransition,
  //       juror: juror.juror.id,
  //       disputeId: round.dispute.id,
  //     }
  //   })
  // })

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
              <span>All Tasks </span>
              {/* <Tag limitDigits={4} label={disputes.length} size="small" /> */}
            </div>,
            <div>
              <span>My Tasks </span>
              {/* <Tag limitDigits={4} label={jurorDisputes.length} size="small" /> */}
            </div>,
          ]}
          selected={0}
          onChange={() => {}}
        />
      </div>
      <TaskTable tasks={tasks} />
    </>
  )
}

export default Tasks
