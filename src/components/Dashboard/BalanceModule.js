import React from 'react'
import { Box, GU, Split, useLayout, useTheme } from '@aragon/ui'

import Profile from './Profile'
import Balance from './Balance'
import Information from './AccountBanner'

import { useCourtConfig } from '../../providers/CourtConfig'

// TODO: import icons from aragon-ui when available
import walletIcon from '../../assets/wallet.svg'
import inactiveANJIcon from '../../assets/anj-inactive.svg'
import activeANJIcon from '../../assets/anj-active.svg'

import { getAccountStatus } from '../../utils/account-utils'
import { useConnectedAccount } from '../../providers/Web3'

const BalanceModule = React.memo(
  ({
    balances,
    onRequestActivate,
    onRequestDeactivate,
    onRequestStakeActivate,
    onRequestWithdraw,
  }) => {
    console.log('tra')
    const theme = useTheme()
    const { name: layout } = useLayout()
    const connectedAccount = useConnectedAccount()
    const { minActiveBalance } = useCourtConfig()

    const oneColumn = layout === 'small' || layout === 'medium'
    const status = getAccountStatus(balances, minActiveBalance)

    const { walletBalance, activeBalance, inactiveBalance } = balances

    return (
      <Split
        primary={
          <div
            css={`
              display: flex;
              flex-direction: column;
              height: 100%;
            `}
          >
            <Box
              css={`
                border: 0;
              `}
              padding={3 * GU}
            >
              <Information
                status={status}
                minActiveBalance={minActiveBalance}
              />
            </Box>
            <div
              css={`
                display: ${oneColumn ? 'block' : 'flex'};
                flex-grow: 1;
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
                  amount={inactiveBalance.amount}
                  label="Inactive"
                  mainIcon={inactiveANJIcon}
                  mainIconBackground="#FEF3F1"
                  actions={[
                    // TODO: Memoize array
                    { label: 'Withdraw', onClick: onRequestWithdraw },
                    {
                      label: 'Activate',
                      mode: 'strong',
                      onClick: onRequestActivate,
                    },
                  ]}
                  activity={inactiveBalance.latestMovement}
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
                  amount={activeBalance.amount}
                  label="Active"
                  mainIcon={activeANJIcon}
                  mainIconBackground={`linear-gradient(35deg, ${theme.accentStart}  -75%, ${theme.accentEnd} 105%)`}
                  actions={[
                    { label: 'Deactivate', onClick: onRequestDeactivate },
                  ]} // TODO: Memoize array
                  activity={activeBalance.latestMovement}
                />
              </Box>
            </div>
          </div>
        }
        secondary={
          <Box
            padding={0}
            css={`
              overflow: hidden;
              border: 0;
              height: 100%;
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
                amount={walletBalance.amount}
                label="My wallet"
                mainIcon={walletIcon}
                mainIconBackground="#FEF3F1"
                actions={[
                  {
                    label: 'Activate',
                    mode: 'strong',
                    onClick: onRequestStakeActivate,
                  },
                ]} // TODO: Memoize array
                activity={walletBalance.latestMovement}
              />
            </div>
          </Box>
        }
        invert={oneColumn ? 'vertical' : 'horizontal'}
      />
    )
  }
)

export default BalanceModule
