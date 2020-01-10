import React, { useMemo } from 'react'
import { Box, GU, Split, useLayout, useTheme } from '@aragon/ui'

import Profile from './Profile'
import Balance from './Balance'
import Information from './AccountInformation'

import { useANJRate } from '../../hooks/useANJ'
import { useCourtConfig } from '../../providers/CourtConfig'

// TODO: import icons from aragon-ui when available
import walletIcon from '../../assets/wallet.svg'
import inactiveANJIcon from '../../assets/anj-inactive.svg'
import activeANJIcon from '../../assets/anj-active.svg'

import { getAccountStatus } from '../../utils/account-utils'
import { useConnectedAccount } from '../../providers/Web3'

// adjust amounts and get value from anj-usd rate
const useBalances = balances => {
  const anjRate = useANJRate()
  const { anjToken } = useCourtConfig()

  const balancesKey = Object.values(balances).join('')
  const convertedBalances = useMemo(
    () =>
      Object.keys(balances).reduce((acc, key) => {
        const amount = balances[key]
        const adjustedAmount = amount / Math.pow(10, anjToken.decimals)
        return {
          ...acc,
          [key]: {
            amount: adjustedAmount,
            convertedAmount: adjustedAmount * anjRate,
          },
        }
      }, {}),
  [balancesKey, anjRate] // eslint-disable-line
  )

  return convertedBalances
}

const BalanceModule = React.memo(
  ({
    balances,
    movements,
    onRequestActivate,
    onRequestDeactivate,
    onRequestWithdraw,
  }) => {
    const theme = useTheme()
    const { name: layout } = useLayout()
    const connectedAccount = useConnectedAccount()
    const { minActiveBalance } = useCourtConfig()

    const {
      walletMovement,
      inactiveBalanceMovement,
      activeBalanceMovement,
    } = movements

    const oneColumn = layout === 'small' || layout === 'medium'

    const convertedBalances = useBalances(balances)
    const status = getAccountStatus(balances, minActiveBalance)

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
              <Information
                status={status}
                minActiveBalance={minActiveBalance}
              />
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
                  {...convertedBalances.availableBalance}
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
                  activity={inactiveBalanceMovement}
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
                  {...convertedBalances.activeBalance}
                  label="Active"
                  mainIcon={activeANJIcon}
                  mainIconBackground={`linear-gradient(35deg, ${theme.accentStart}  -75%, ${theme.accentEnd} 105%)`}
                  actions={[
                    { label: 'Deactivate', onClick: onRequestDeactivate },
                  ]} // TODO: Memoize array
                  activity={activeBalanceMovement}
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
                {...convertedBalances.walletBalance}
                label="My wallet"
                mainIcon={walletIcon}
                mainIconBackground="#FEF3F1"
                actions={[
                  {
                    label: 'Activate',
                    mode: 'strong',
                    onClick: onRequestActivate,
                  },
                ]} // TODO: Memoize array
                activity={walletMovement}
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
