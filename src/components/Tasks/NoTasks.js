import React from 'react'
import { Box, GU } from '@aragon/ui'
import noTasks from '../../assets/noTasks.svg'

function NoTasks() {
  return (
    <Box>
      <div
        css={`
          margin: ${15 * GU}px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <img
          css={`
            height: 300px;
          `}
          src={noTasks}
          alt="No Tasks"
        />
      </div>
    </Box>
  )
}

export default NoTasks
