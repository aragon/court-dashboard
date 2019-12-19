import React from 'react'
import { Box, GU, Split, useLayout, useTheme } from '@aragon/ui'
import Profile from './Profile'

import { balances } from '../../mock-data'
import Balance from './Balance'
import Information from './AccountInformation'

import walletIcon from '../../assets/wallet.svg'
import inactiveANJIcon from '../../assets/anj-inactive.svg'
import activeANJIcon from '../../assets/anj-active.svg'

import {
  ACCOUNT_STATUS_ACTIVE,
  // ACCOUNT_STATUS_INACTIVE,
} from '../../dispute-status-type'

function BalanceModule({ active, connectedAccount }) {
  const theme = useTheme()
  const { name: layout } = useLayout()
  const oneColumn = layout === 'small' || layout === 'medium'

  const status = ACCOUNT_STATUS_ACTIVE

  return (
    <Split
      primary={
        <React.Fragment>
          <Box
            css={`
              border: 0;
            `}
            padding={3 * GU}
          >
            <Information status={status} />
          </Box>
          <div
            css={`
              display: ${oneColumn ? 'block' : 'flex'};
            `}
          >
            <Box
              padding={3 * GU}
              css={`
                flex-basis: 50%;
                margin-top: ${2 * GU}px;
                margin-right: ${oneColumn ? 0 : `${2 * GU}px`};
                border: 0;
              `}
            >
              <Balance
                {...balances.inactive}
                label="Inactive"
                mainIcon={inactiveANJIcon}
                mainIconBackground="#FEF3F1"
              />
            </Box>
            <Box
              padding={3 * GU}
              css={`
                flex-basis: 50%;
                border: 0;
              `}
            >
              <Balance
                {...balances.active}
                label="Active"
                mainIcon={activeANJIcon}
                mainIconBackground={`linear-gradient(35deg, ${theme.accentStart}  -75%, ${theme.accentEnd} 105%)`}
              />
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
          <Profile status={status} account={connectedAccount} />
          <div
            css={`
              padding: ${3 * GU}px;
              margin-top: ${2 * GU}px;
            `}
          >
            <Balance
              {...balances.wallet}
              label="My wallet"
              mainIcon={walletIcon}
              mainIconBackground="#FEF3F1"
            />
          </div>
        </Box>
      }
      invert={oneColumn ? 'vertical' : 'horizontal'}
    />
  )
}

export default BalanceModule
