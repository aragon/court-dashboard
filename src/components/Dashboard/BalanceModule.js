import React from 'react'
import { Box, GU, Split, useViewport } from '@aragon/ui'
import Profile from './Profile'
import MyWallet from './MyWallet'

import { balances } from '../../mock-data'

function BalanceModule({ active, connectedAccount }) {
  // const theme = useTheme()
  const { below } = useViewport()

  return (
    <Split
      primary={
        <React.Fragment>
          <Box
            css={`
              border: 0;
            `}
            padding={24}
          >
            <div>Information</div>
          </Box>
          <div
            css={`
              display: flex;
            `}
          >
            <Box
              padding={24}
              css={`
                flex-basis: 50%;
                margin-top: ${2 * GU}px;
                margin-right: ${2 * GU}px;
                border: 0;
              `}
            >
              <div>inactive</div>
            </Box>
            <Box
              padding={24}
              css={`
                flex-basis: 50%;
                border: 0;
              `}
            >
              <div>active</div>
            </Box>
          </div>
        </React.Fragment>
      }
      secondary={
        <Box
          padding={0}
          css={`
            overflow: hidden;
            border: 0;
          `}
        >
          <Profile active account={connectedAccount} />
          <MyWallet {...balances.wallet} />
        </Box>
      }
      invert={below('large') ? 'vertical' : 'horizontal'}
    />
  )
}

export default BalanceModule
